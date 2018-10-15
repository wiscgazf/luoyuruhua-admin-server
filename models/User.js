let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');
let userImg = ['/upload/user/user.png', '/upload/user/user1.jpg', '/upload/user/user2.jpg'];
let randomImg = parseInt(3 * Math.random());

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
        default: userImg[randomImg]
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