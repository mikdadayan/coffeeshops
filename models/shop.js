const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const shopSchema = new Schema({
   name: {
       type: String,
       required: true
    },
   imageUrl: {
       type: String,
       required: true
    },
    description: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String,
        requried: true
    },

    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model('Shop', shopSchema);