let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let nodesSchema = new mongoose.Schema({
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
    thumbImg: String,
    content: {
        type: String,
        require: true
    },
    pageView: {
        type: Number,
        default: 0
    },
    tag: Array,
    category: String,
    description: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    replyData: [{type: mongoose.Schema.Types.ObjectId, ref: 'reply'}]
});


module.exports = db.zhoufeiMongoose.model('notes', nodesSchema);