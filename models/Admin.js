let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: Number,
    sex: Number,
    email: String,
    phone: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    userImg: {
        type: String,
        default: '/upload/admin/admin.png'
    },
    signature: String,
    createTime: {
        type: Date,
        default: Date.now()
    },
    lastUpdateTime: {
        type: Date,
        default: Date.now()
    },
    loginTime: {
        type: String,
        default: ''
    },
    permissions: String,
    replyData: [{type: mongoose.Schema.Types.ObjectId, ref: 'reply'}],
    notesData: [{type: mongoose.Schema.Types.ObjectId, ref: 'notes'}]
});


module.exports = db.zhoufeiMongoose.model('admin', adminSchema);