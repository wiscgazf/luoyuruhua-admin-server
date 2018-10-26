let objFun = {};
let fs = require('fs');
let moment = require('moment');
let path = require('path');
let Promise = require('bluebird');
let mongoose = require('mongoose');
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
    let asyncFun = async () => {
        try {
            await Showreel.findOneAndUpdate({_id: req.params.id}, {$inc: {pageView: 1}});

            let showreelDetail = Showreel.findById(req.params.id);

            let likeData = Showreel.find({
                _id: {$ne: showreelDetail._id},
                $or: [{title: {$regex: new RegExp(showreelDetail.title, 'i')}}, {category: {$regex: new RegExp(showreelDetail.category, 'i')}}]
            }).limit(3);
            // pre page
            let prePage = Showreel.find({_id: {$lt: req.params.id}}).limit(1);

            // nextPage
            let nextPage = Showreel.find({_id: {$gt: req.params.id}}).limit(1);

            //replyNum
            let replyNum = Reply.aggregate([{
                $match: {notesData: new mongoose.Types.ObjectId(req.params.id)}
            }, {
                $project: {
                    _id: 1, replyNum: {$size: '$replyData'}
                }
            }, {$group: {_id: null, replyNumber: {$sum: '$replyNum'}}}]);

            let showreelCount = Showreel.countDocuments();

            let pageViewSort = Showreel.find().sort({pageView: -1}).limit(3).exec();

            return [showreelDetail, likeData, prePage, nextPage, replyNum, showreelCount, pageViewSort];
        }
        catch (err) {
            res.status(500).json(Errors.networkError);
        }
    }
    Promise.all(asyncFun()).then(data => {
        res.render('pc/showreelDetail', {
            Data: {
                id: data[0]._id,
                createTime: moment(data[0].createTime).format("YYYY-MM-DD"),
                title: data[0].title,
                pageView: data[0].pageView,
                category: data[0].category,
                tecTag: data[0].tecTag,
                content: data[0].content,
                thumbImg: data[0].thumbImg,
                showreelUrl: data[0].showreelUrl
            },
            likesData: data[1],
            preData: data[2],
            nextData: data[3],
            replyNum: data[4],
            showreelCount: data[5],
            pageViewSort: data[6].map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    thumbImg: item.thumbImg,
                    createTime: moment(item.createTime).format("YYYY-MM-DD"),
                    pageView: item.pageView
                }
            }),
            csrfToken: req.csrfToken()
        });
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}

objFun.showreelList = function (req, res, next) {
    let count = 0;
    let pageSize = 0;
    let showCount = 10;
    let currentPage = req.query.page || 1;
    let asyncFun = async () => {
        if (req.query.search) {
            count = await Showreel.countDocuments({$or: [{title: {$regex: new RegExp(req.query.search, 'i')}}, {category: {$regex: new RegExp(req.query.search, 'i')}}]});
        } else {
            count = await Showreel.countDocuments();
        }
        let pageView = await Showreel.find().limit(3).sort({pageView: -1});
        if (count == 0) {
            return [[], pageView, count];
        } else {
            pageSize = Math.ceil(count / showCount);

            if (currentPage >= pageSize) {
                currentPage = pageSize;
            }

            if (currentPage <= 0) {
                currentPage = 1;
            }
            let queryData = '';
            if (req.query.search) {
                queryData = Showreel.find({$or: [{title: {$regex: new RegExp(req.query.search, 'i')}}, {category: {$regex: new RegExp(req.query.search, 'i')}}]});
            } else {
                queryData = Showreel.find();
            }
            let showreelData = await queryData.populate({
                path: 'replyData',
                model: 'reply'
            }).limit(showCount).skip((currentPage - 1) * showCount).sort({createTime: -1}).exec();
            return [showreelData, pageView, count];
        }
    }
    Promise.all(asyncFun()).then(data => {
        let publicObj = {
            search: req.query.search,
            count: count,
            pageSize: pageSize,
            showCount: showCount,
            currentPage: currentPage,
            pagePath: '/showreelList'
        }
        let pageViews = data[1].map((item) => {
            return {
                id: item._id,
                createTime: moment(item.createTime).format("YYYY-MM-DD"),
                title: item.title,
                thumbImg: item.thumbImg,
                pageView: item.pageView
            }
        });
        if (data[2] == 0) {
            res.render('pc/showreelList', Object.assign(publicObj, {Datas: []}, {PageView: pageViews}));
        } else {
            res.render('pc/showreelList', Object.assign(publicObj, {
                Datas: data[0].map(item => {
                return {
                    id: item._id,
                    createTime: moment(item.createTime).format("YYYY-MM-DD"),
                    title: item.title,
                    thumbImg: item.thumbImg,
                    pageView: item.pageView,
                    category: item.category,
                    replyData: item.replyData
                }
        })
            }, {PageView: pageViews}));
        }
    }).catch(err => {
        console.log(err)
    })
}
/*
*
* server ajax
* */

objFun.addShowreelImg = function (req, res, next) {
    let base64Data = req.body.thumbImg.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = Buffer.from(base64Data, 'base64');
    let imgName = new Date().getTime();
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
                category: data.category,
                showreelUrl: data.showreelUrl
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
        showreelUrl: req.body.form.showreelUrl
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