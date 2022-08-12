const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const commentSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        replies: [{
            type: mongoose.Types.ObjectId,
            ref: 'Comment'
        }]
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);


/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
