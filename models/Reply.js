let mongoose = require('mongoose');

let db = require('../config/mongodbConfig');

let replySchema = new mongoose.Schema({
    notesData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notes'
    },
    userData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
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