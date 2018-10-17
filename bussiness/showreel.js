let objFun = {};
let fs = require('fs');
let moment = require('moment');
let path = require('path');
let Promise = require('bluebird');
let Errors = require('../err/errors');

let User = require('../models/User'); // user db
let Admin = require('../models/Admin'); // admin db
let Showreel = require('../models/Showreel'); // showreel db
let Reply = require('../models/Reply'); // reply db

/*
*
* show  page router
* */

objFun.showreelSuc = (req, res, next) => {
    let count = 0;
    let pageSize = 0;
    let showCount = 10;
    let currentPage = req.query.page || 1;
    Promise.try(() => {
        return Showreel.countDocuments();
    }).then(data => {
        count = data;
        if (count == 0) {
            res.render('pc/showreel', {
                Datas: [],
                count: count,
                pageSize: pageSize,
                showCount: showCount,
                currentPage: currentPage,
                pagePath: '/showreel'
            });
        } else {
            pageSize = Math.ceil(count / showCount);

            if (currentPage >= pageSize) {
                currentPage = pageSize;
            }

            if (currentPage <= 0) {
                currentPage = 1;
            }
            return Showreel.find().populate({
                path: 'replyData',
                model: 'reply'
            }).limit(showCount).skip((currentPage - 1) * showCount).sort({createTime: -1}).exec();
        }
    }).then(data => {
        if (data) {
            res.render('pc/showreel', {
                Datas: data.map(item => {
                    return {
                        id: item._id,
                        createTime: moment(item.createTime).format("YYYY-MM-DD"),
                        title: item.title,
                        thumbImg: item.thumbImg,
                        pageView: item.pageView,
                        category: item.category,
                        replyData: item.replyData
                    }
                }),
                count: count,
                pageSize: pageSize,
                showCount: showCount,
                currentPage: currentPage,
                pagePath: '/showreel',
                search: ''
            });
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.showreelDetail = function (req, res, next) {
    res.render('pc/showreelDetail');
}

/*
*
* server ajax
* */

objFun.addShowreelImg = function (req, res, next) {
    let base64Data = req.body.thumbImg.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = Buffer.from(base64Data, 'base64');
    var imgName = new Date().getTime();
    fs.writeFile(path.join(__dirname, '../static/upload/showreel/') + imgName + '.png', dataBuffer, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            let baseImg = '/upload/showreel/' + imgName + '.png';
            res.json(Object.assign(Errors.addthumbImgSuc, {thumbImg: baseImg}));
        }
    });
}

objFun.addShowreel = function (req, res, next) {
    Showreel.create(req.body.form, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Errors.addShowreelSuc);
        }
    })
}

objFun.allShowreel = function (req, res, next) {
    let baseMsg = req.query;
    let reg = new RegExp(baseMsg.title);
    let totalCount = 1;
    let totalPage = 1;
    Promise.try(() => {
        if (baseMsg.dataRange == '' || !baseMsg.dataRange) {
            return Showreel.countDocuments({title: {$regex: reg}});
        } else {
            return Showreel.countDocuments({
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
            return Showreel.find({title: {$regex: reg}}).populate({
                path: 'replyData',
                model: 'reply'
            }).skip(pageOffset).limit(parseInt(baseMsg.showCount)).sort({createTime: -1}).exec();
        } else {
            return Showreel.find({
                title: {$regex: reg},
                $and: [{createTime: {$gte: moment(baseMsg.dataRange[0]).format()}}, {createTime: {$lte: moment(baseMsg.dataRange[1]).format()}}]
            }).populate({
                path: 'replyData',
                model: 'reply'
            }).sort({createTime: -1}).skip(pageOffset).limit(parseInt(baseMsg.showCount)).exec();
        }
    }).then(data => {
        res.json({msg: 'suc', code: '200', totalPage: totalPage, totalCount: totalCount, des: '成功', Datas: data})
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.getShowreel = function (req, res, next) {
    Showreel.findById(req.query.id, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Object.assign(Errors.getShowreelSuc, {
                title: data.title,
                thumbImg: data.thumbImg,
                content: data.content,
                tecTag: data.tecTag,
                category: data.category
            }))
        }
    })
}

objFun.putShowreel = function (req, res, next) {
    let modifiedData = {
        title: req.body.form.title,
        thumbImg: req.body.form.thumbImg,
        content: req.body.form.content,
        tecTag: req.body.form.tecTag,
        category: req.body.form.category,
    }
    Showreel.update({_id: req.body.id}, {$set: modifiedData}, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Errors.editShowreelSuc);
        }
    })
}

objFun.delShowreel = function (req, res, next) {
    let delShowreel = async () => {
        try {
            await Showreel.remove({_id: req.body.id});
            let delSuc = Reply.remove({notesData: req.body.id});
            return delSuc;
        }
        catch (err) {
            res.status(500).json(Errors.networkError);
        }
    }
    delShowreel().then(data => {
        res.json(Errors.delShowreelSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

/*
*web ajax
*
* */

module.exports = objFun;