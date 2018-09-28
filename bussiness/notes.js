let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let Promise = require("bluebird");
let moment = require('moment');
let mongoose = require('mongoose');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db
let User = require('../models/User'); // user db
let Notes = require('../models/Notes'); // notes db
let Reply = require('../models/Reply'); // Reply db

objFun.notesList = function (req, res, next) {  // find all notes and condition find
    let count = 0;
    let pageSize = 0;
    let showCount = 10;
    let currentPage = req.query.page || 1;
    Promise.try(() => {
        if (req.query.search) {
            return Notes.countDocuments({$or: [{title: {$regex: new RegExp(req.query.search, 'i')}}, {category: {$regex: new RegExp(req.query.search, 'i')}}, {description: {$regex: new RegExp(req.query.search, 'i')}}]});
        } else {
            return Notes.countDocuments();
        }
    }).then(data => {
        let queryData = '';
        count = data;
        if (count == 0) {
            res.render('pc/notesList', {
                Datas: [],
                search: req.query.search,
                count: count,
                pageSize: pageSize,
                showCount: showCount,
                currentPage: currentPage,
                pagePath: '/notes'
            });
        } else {
            pageSize = Math.ceil(count / showCount);

            if (currentPage >= pageSize) {
                currentPage = pageSize;
            }

            if (currentPage <= 0) {
                currentPage = 1;
            }

            if (req.query.search) {
                queryData = Notes.find({$or: [{title: {$regex: new RegExp(req.query.search, 'i')}}, {category: {$regex: new RegExp(req.query.search, 'i')}}, {description: {$regex: new RegExp(req.query.search, 'i')}}]});
            } else {
                queryData = Notes.find();
            }
            return queryData.populate({
                path: 'author',
                select: 'name',
                model: 'admin'
            }).populate({
                path: 'replyData',
                model: 'reply'
            }).limit(showCount).skip((currentPage - 1) * showCount).sort({createTime: -1}).exec();
        }
    }).then(data => {
        if (data) {
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
                        replyData: item.replyData
                    }
                }),
                search: req.query.search,
                count: count,
                pageSize: pageSize,
                showCount: showCount,
                currentPage: currentPage,
                pagePath: '/notes'
            });
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })

}

objFun.notesDetail = function (req, res, next) {  //notesDetail
    Promise.try(() => {
        return Notes.findOneAndUpdate({_id: req.params.id}, {$inc: {pageView: 1}});
    }).then(data => {
        return Notes.findById(req.params.id).populate({path: 'author', select: 'name', model: 'admin'}).exec();
    }).then(data => {
        // guess what you like
        let likes = Notes.find({
            _id: {$ne: data._id},
            $or: [{title: {$regex: new RegExp(data.title, 'i')}}, {category: {$regex: new RegExp(data.category, 'i')}}, {description: {$regex: new RegExp(data.title, 'i')}}],
        }).limit(3);
        // pre page
        let prePage = Notes.find({_id: {$lt: req.params.id}}).limit(1);

        // nextPage
        let nextPage = Notes.find({_id: {$gt: req.params.id}}).limit(1);

        // reply Number
        let replyNum = Reply.aggregate([{
            $match: {notesData: new mongoose.Types.ObjectId(req.params.id)}
        }, {
            $project: {
                _id: 1, replyNum: {$size: '$replyData'}
            }
        }, {$group: {_id: null, replyNumber: {$sum: '$replyNum'}}}]);

        Promise.all([likes, prePage, nextPage, replyNum]).then(data1 => {
            res.render('pc/nodeDetail', {
                Data: {
                    id: data._id,
                    createTime: moment(data.createTime).format("YYYY-MM-DD"),
                    title: data.title,
                    pageView: data.pageView,
                    category: data.category,
                    description: data.description,
                    author: data.author,
                    replyData: data1[3],
                    tag: data.tag
                },
                content: JSON.stringify(data.content),
                likesData: data1[0],
                preData: data1[1],
                nextData: data1[2],
            });
        })
    }).catch(err => {
        res.status(500).json(Errors.networkError);
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
            }).populate({
                path: 'replyData',
                model: 'reply'
            }).skip(pageOffset).limit(parseInt(baseMsg.showCount)).sort({createTime: -1}).exec();
        } else {
            return Notes.find({
                title: {$regex: reg},
                $and: [{createTime: {$gte: moment(baseMsg.dataRange[0]).format()}}, {createTime: {$lte: moment(baseMsg.dataRange[1]).format()}}]
            }).populate({
                path: 'author',
                select: 'name',
                model: 'admin'
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
objFun.addCommentAjax = function (req, res, next) {     // public comments
    let commentData = req.body;
    let reviewerId = req.app.locals.username._id;
    if (!commentData.replyId || commentData.fromReviewerId == reviewerId) {
        Promise.try(() => {
            return Reply.create({
                notesData: commentData.articleId,
                userData: reviewerId,
                replyData: [
                    {
                        from: null,
                        to: reviewerId,
                        content: commentData.content
                    }
                ]
            });
        }).then(data => {
            return Notes.findByIdAndUpdate(commentData.articleId, {
                $push: {
                    replyData: data._id
                }
            });
        }).then(data => {
            if (data) {
                res.json(Errors.replySuc);
            }
        }).catch(err => {
            res.status(500).json(Errors.networkError);
        });
    } else {
        Reply.findByIdAndUpdate(commentData.replyId, {
            $push: {
                replyData: {
                    from: commentData.fromReviewerId,
                    to: reviewerId,
                    content: commentData.content
                }
            }
        }, function (err, data) {
            if (err) {
                res.status(500).json(Errors.networkError);
            } else {
                res.json({suc: '123'})
            }
        })
    }
}

objFun.getCommentAjax = function (req, res, next) {
    let count = 0;
    let pageSize = 0;
    let showCount = 10;
    let currentPage = req.query.page || 1;
    Promise.try(() => {
        return Reply.countDocuments({notesData: req.query.id});
    }).then(data => {
        count = data;
        if (!count) {
            res.json({Data: null, code: '200'});
        } else {
            pageSize = Math.ceil(data / showCount);

            if (currentPage >= pageSize) {
                currentPage = pageSize;
            }

            if (currentPage <= 0) {
                currentPage = 1;
            }

            return Reply.find({notesData: req.query.id}).populate({
                path: 'notesData',
                model: 'notes'
            }).populate({
                path: 'userData',
                model: 'user',
                select: 'name userImg'
            }).populate({
                path: 'replyData.from',
                model: 'user',
                select: 'name userImg'
            }).populate({
                path: 'replyData.to',
                model: 'user',
                select: 'name userImg'
            }).skip(parseInt(showCount * (currentPage - 1))).limit(showCount).sort({'replyData.createTime': -1});
        }
    }).then(data => {
        if (data) {
            res.json({Data: data, code: '200'});
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })

}
module.exports = objFun;