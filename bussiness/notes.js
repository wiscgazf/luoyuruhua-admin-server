let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let path = require('path');
let sendEmail = require('../utils/sendEmail');
let Promise = require("bluebird");
let moment = require('moment');
let mongoose = require('mongoose');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db
let User = require('../models/User'); // user db
let Notes = require('../models/Notes'); // notes db
let Reply = require('../models/Reply'); // Reply db
let Showreel = require('../models/Showreel'); // Showreel db

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
    fs.writeFile(path.join(__dirname, '../static/upload/notes/') + imgName + '.png', dataBuffer, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            let baseImg = '/upload/notes/' + imgName + '.png';
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
            res.json({msg: 'suc', code: '200', totalPage: 0, totalCount: 0, des: '閹存劕濮?, Datas: []})
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
        res.json({msg: 'suc', code: '200', totalPage: totalPage, totalCount: totalCount, des: '閹存劕濮?, Datas: data})
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

objFun.editNotesAjax = function (req, res, next) {  // edit Notes bussiness
    Notes.update({_id: req.body.id}, {$set: req.body.form}, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Errors.editNotesSuc);
        }
    })
}

objFun.delNotesAjax = function (req, res, next) {   // delete Notes bussiness
    let asyncFun = async () => {
        await Admin.update({_id: req.body.id}, {$pull: {notesData: req.body.notesId}});
        await Notes.remove({_id: req.body.notesId});
        let delSuc = Reply.remove({notesData: req.body.notesId});
        return delSuc;
    }
    asyncFun().then(data => {
        res.json(Errors.delNotesSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.getCommentDataAjax = function (req, res, next) { // server get comments Data bussiness
    let matchObj = {};
    let total = 0;
    let totalPage = 0;
    Promise.try(() => {
        if (req.query.dataTime) {
            matchObj = {
                $and: [{
                    'replyData.createTime': {
                        $gte: new Date(moment(req.query.dataTime[0]).format()),
                        $lte: new Date(moment(req.query.dataTime[1]).format())
                    }
                }, {'status': parseInt(req.query.channelId)}]
            }
        } else {
            matchObj = {
                'status': parseInt(req.query.channelId)
            }
        }
        return Reply.aggregate([{$unwind: '$replyData'}, {$match: matchObj}, {$count: 'totalCount'}]);
    }).then(data => {
        if (data.length == 0) {
            res.json({msg: '1', code: '200', des: 'succsss', Data: null});
        } else {
            total = data[0].totalCount;
            totalPage = Math.ceil(total / req.query.showCount);
            let skipNum = parseInt(req.query.currentPage - 1) * parseInt(req.query.showCount);
            return Reply.aggregate([{$unwind: '$replyData'}, {$match: matchObj}, {$skip: skipNum}, {
                $project: {_id: 1, notesData: 1, replyData: 1, status: 1}
            }, {$sort: {'replyData.createTime': -1}}]);
        }
    }).then(data => {
        if (req.query.channelId == 0) {
            return Notes.populate(data, {model: 'notes', select: 'title', path: 'notesData'});
        }
    }).then(data => {
        return User.populate(data, {model: 'user', select: 'name userImg', path: 'replyData.to replyData.from'});
    }).then(data => {
        res.json({Data: data, total: total, totalPage: totalPage});
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
};

objFun.deleteCommentDataAjax = function (req, res, next) {
    let asyncFun = async function () {
        let delSuc = {};
        let filterComment = await Reply.aggregate([{$match: {_id: new mongoose.Types.ObjectId(req.body.commentId)}}, {
            $project: {
                _id: 0,
                childCommentNum: {
                    $size: '$replyData'
                }
            }
        }]);
        if (filterComment[0].childCommentNum == 1) {
            await Reply.remove({_id: req.body.commentId});
            delSuc = await Notes.update({_id: req.body.articleID}, {$pull: {replyData: req.body.commentId}});
        } else {
            delSuc = await Reply.update({_id: req.body.commentId}, {$pull: {replyData: {_id: req.body.commentChildId}}});
        }
        return delSuc;
    }
    asyncFun().then(data => {
        if (data.ok == 1) {
            User.findById(req.body.userId, function (err, data1) {
                if (err) {
                    res.status(500).json(Errors.networkError);
                } else {
                    sendEmail('<span>鐏忓﹥鏆氶惃鍕暏閹村嚖绱?' + data1.email + '></span><p>閹劌銈介敍?/p><span>閻㈠彉绨幃銊ユ躬鐠囥儱閽╅崣棰佺瑐閻ㄥ嫯鐦庣拋杞颁繆閹垱绉归崣濠呯箽鐟欏嫸绱濈化鑽ょ埠瀹歌尪鍤滈崝銊よ礋閹劌鍨归梽銈堫嚉閺壜ょ槑鐠佹亽鈧?/span><p><span style="color: #f00;">濞夈劍鍓伴敍?/span>鏉╂繆顫夊▎鈩冩殶10濞嗏€蹭簰娑撳﹦閮寸紒鐔剁窗閼奉亜濮╅崘鑽ょ波閹劎娈戠拹锔藉煕閿涘矁顕柆闈涚暓缂冩垳绗傞弬鍥ㄦ鐠囧嫯顔戠€瑰牆鍨憴鍕瘱閿?/p><span>缁崵绮洪懛顏勫З閸欐垿鈧緤绱濈拠宄板瑏閻╁瓨甯撮崶鐐差槻濮濄倝鍋栨禒璁圭磼</span>', '<' + data1.email + '>');
                }
            });
            res.json(Errors.delCommentSuc);
        } else {
            res.json(Errors.delCommentError);
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
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
                status: req.query.Status,
                replyData: [
                    {
                        from: null,
                        to: reviewerId,
                        content: commentData.content
                    }
                ]
            });
        }).then(data => {
            let updateData = '';
            if (data.status == 0) {
                updateData = Notes.update({_id: data.notesData}, {$push: {replyData: data._id}});
            }
            if (data.status == 1) {
                updateData = Showreel.update({_id: data.notesData}, {$push: {replyData: data._id}});
            }
            updateData.exec(function (err, result) {
                if (result) {
                res.json(Errors.replySuc);
            }
            });
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
                res.json({suc: '123'});
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
        return Reply.countDocuments({notesData: req.query.id, status: req.query.Status});
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

            return Reply.find({notesData: req.query.id, status: req.query.Status}).populate({
                path: 'userData',
                model: 'user',
                select: 'name userImg'
            }).populate({
                path: 'replyData.from replyData.to',
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