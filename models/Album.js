let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let albumSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        require: true
    },
    photoList: Array,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    kind: {type: mongoose.Schema.Types.ObjectId, ref: 'imgSort'}
});

module.exports = db.zhoufeiMongoose.model('album', albumSchema);