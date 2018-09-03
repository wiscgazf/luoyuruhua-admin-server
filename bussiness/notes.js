let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let Promise = require("bluebird");
let moment = require('moment');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db
let User = require('../models/User'); // user db
let Notes = require('../models/Notes'); // notes db

objFun.notesList = function (req, res, next) {  // find all notes and condition find
    let count = 0;
    let pageSize = 0;
    let showCount = 10;
    let currentPage = req.query.page || 1;
    Promise.try(() => {
        if (req.query.search) {
            return Notes.countDocuments({$or: [{name: {$regex: new RegExp(req.query.search, 'i')}}, {description: {$regex: new RegExp(req.query.search, 'i')}}]});
        } else {
            return Notes.countDocuments();
        }
    }).then(data => {
        count = data;
    }).catch(err => {
        console.log(err)
    })

    Notes.find().populate({
        path: 'author',
        select: 'name',
        model: 'admin'
    }).limit(10).sort({createTime: -1}).exec(function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.render('pc/notesList', {
                Datas: data.map(item => {
                    return {
                        id: item._id,
                        createTime: moment(item.createTime).format("YYYY-MM-DD"),
                        title: item.title,
                        thumbImg: item.thumbImg,
                        pageView: item.pageView,
                        category: item.category,
                        description: item.description,
                        author: item.author,
                        replyData: item.replyData.length
                    }
                })
            })
        }
    })
}

objFun.notesDetail = function (req, res, next) {  //notesDetail
    Notes.findById(req.params.id).populate({path: 'author', select: 'name', model: 'admin'}).exec(function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.render('pc/nodeDetail', {Data: data, content: JSON.stringify(data.content)});
        }
    });
}
// ajax bussiness  ------------------------- server

objFun.addthumbImgAjax = function (req, res, next) {    // add notes thumbImg  bussiness
    let base64Data = req.body.thumbImg.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = Buffer.from(base64Data, 'base64');
    var imgName = new Date().getTime();
    fs.writeFile('static/upload/notes/' + imgName + '.png', dataBuffer, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            let baseImg = '/static/upload/notes/' + imgName + '.png';
            res.json(Object.assign(Errors.addthumbImgSuc, {thumbImg: baseImg}));
        }
    });
}

objFun.addNotesAjax = function (req, res, next) {
    let notesData = req.body;
    let newArr = [];
    Promise.try(() => {
        return Admin.findOne({name: md5.aseDecode(notesData.name, 'zhoufei')});
    }).then(data => {
        newArr = data.notesData;
        return Notes.create(Object.assign(notesData.form, {author: data._id}))
    }).then(data => {
        newArr.push(data._id);
        return Admin.update({_id: data.author}, {$set: {notesData: newArr}});
    }).then(data => {
        res.json(Errors.addNotesSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.allNotesAjax = function (req, res) {     //find all  notes bussiness
    let baseMsg = req.query;
    let reg = new RegExp(baseMsg.title);
    let totalCount = 1;
    let totalPage = 1;
    Promise.try(() => {
        if (baseMsg.dataRange == '' || !baseMsg.dataRange) {
            return Notes.countDocuments({title: {$regex: reg}});
        } else {
            return Notes.countDocuments({
                title: {$regex: reg},
                $and: [{createTime: {$gte: moment(baseMsg.dataRange[0]).format()}}, {createTime: {$lte: moment(baseMsg.dataRange[1]).format()}}]
            });
        }
    }).then(data => {
        totalCount = data;
        if (totalCount == 0) {
            res.json({msg: 'suc', code: '200', totalPage: 0, totalCount: 0, des: '成功', Datas: []})
        }
        let currentPage = baseMsg.currentPage ? baseMsg.currentPage : 1;
        totalPage = Math.ceil(totalCount / baseMsg.showCount);
        if (currentPage >= totalPage) {
            currentPage = totalPage;
        }

        if (currentPage <= 1) {
            currentPage = 1;
        }

        let pageOffset = (currentPage - 1) * baseMsg.showCount;

        if (baseMsg.dataRange == '' || !baseMsg.dataRange) {
            return Notes.find({title: {$regex: reg}}).populate({
                path: 'author',
                select: 'name',
                model: 'admin'
            }).skip(pageOffset).limit(parseInt(baseMsg.showCount)).sort({createTime: -1}).exec();
        } else {
            return Notes.find({
                title: {$regex: reg},
                $and: [{createTime: {$gte: moment(baseMsg.dataRange[0]).format()}}, {createTime: {$lte: moment(baseMsg.dataRange[1]).format()}}]
            }).populate({
                path: 'author',
                select: 'name',
                model: 'admin'
            }).sort({createTime: -1}).skip(pageOffset).limit(parseInt(baseMsg.showCount)).exec();
        }
    }).then(data => {
        res.json({msg: 'suc', code: '200', totalPage: totalPage, totalCount: totalCount, des: '成功', Datas: data})
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.findNotesAjax = function (req, res, next) {  // find notes bussiness
    Notes.findById(req.query.id).populate({path: 'author', select: 'name', model: 'admin'}).exec(function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Object.assign(Errors.findNotesSuc, {
                Datas: {
                    title: data.title,
                    category: data.category,
                    tag: data.tag,
                    thumbImg: data.thumbImg,
                    content: data.content,
                    description: data.description
                }
            }))
        }
    })
}

objFun.editNotesAjax = function (req, res, next) {
    Notes.update({_id: req.body.id}, {$set: req.body.form}, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Errors.editNotesSuc);
        }
    })
}

objFun.delNotesAjax = function (req, res, next) {
    let updateData = [];
    Promise.try(() => {
        return Admin.findById(req.body.id);
    }).then(data => {
        data.notesData.map((item, index) => {
            if (item._id == req.body.notesId) {
                return data.notesData.splice(index, 1)
            }
        })
        return Admin.update({_id: req.body.id}, {$set: {notesData: data.notesData}});
    }).then(data => {
        return Notes.remove({_id: req.body.notesId});
    }).then(data => {
        res.json(Errors.delNotesSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

// ajax bussiness  ------------------------- web


module.exports = objFun;