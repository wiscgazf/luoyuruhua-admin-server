let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: Number,
    sex: Number,
    email: String,
    phone: String,
    password: {
        type: String,
        require: true
    },
    userImg: {
        type: String,
        default: '/static/upload/admin.png'
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
    replyData: [{type: mongoose.Schema.Types.ObjectId, ref: 'reply'}]
});


module.exports = db.zhoufeiMongoose.model('user', userSchema);