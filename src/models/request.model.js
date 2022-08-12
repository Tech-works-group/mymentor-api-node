const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const requestSchema = mongoose.Schema(
    {
        status: {
            type: String,
            enum: ['approved', 'pending', 'rejected']
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        post: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Post'
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);


/**
 * @typedef Request
 */
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
