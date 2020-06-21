const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    time: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Comment', commentSchema);