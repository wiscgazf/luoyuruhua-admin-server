let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let replySchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },
    notesData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notes'
    },
    userData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    replyData: [
        {
            createTime: {
                type: Date,
                default: Date.now
            },
            from: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            to: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            content: String
        }
    ]
});


module.exports = db.zhoufeiMongoose.model('reply', replySchema);