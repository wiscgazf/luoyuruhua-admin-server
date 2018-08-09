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
        default: 'static/upload/726209185373770133.jpg'
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
    }
});


module.exports = db.zhoufeiMongoose.model('admin', adminSchema);