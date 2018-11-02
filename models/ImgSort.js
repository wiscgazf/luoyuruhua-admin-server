let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let imgSortSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        require: true
    },
    description: String,
    thumbImg: String,
    pageView: {
        type: Number,
        default: 0
    },
    replyData: [{type: mongoose.Schema.Types.ObjectId, ref: 'reply'}]
});

module.exports = db.zhoufeiMongoose.model('imgSort', imgSortSchema);