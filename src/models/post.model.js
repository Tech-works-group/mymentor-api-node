const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { designationsEnums } = require('./constants')

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'

        },

        description: {
            type: String,
            required: true
        },
        certificate: {
            type: Boolean,
            required: true,
            default: false
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        amount: {
            price: {
                type: Number
            },
            currency: {
                type: String,
                enum: ['usd', 'sdg']
            }
        },
        location: {
            type: String,
            enum: ['remote', 'onSite'],
        },
        address: String
        ,
        duration: {
            durationType: {
                type: String,
                enum: ['open', 'closed']
            },
            duration: {
                type: Number
            },
            unit: {
                type: String,
                enum: ['day', 'week', 'month', 'year']
            }
        },
        hiring: Boolean,
        experience: {
            duration: Number,
            unit: {
                type: String,
                enum: ['month', 'year']
            }
        },
        responsibilities: [String],
        requirements: [String],
        outcomes: [String],
        background: [String],
        tasks: [String],
        comments: [{
            type: mongoose.Types.ObjectId,
            ref: 'Comment'
        }],
        status: {
            type: String,
            enum: ['open', 'closed', 'ongoing']
        },
        postType: {
            type: String,
            enum: ['opportunity', 'request'],
            required: true
        },
        requests: [{
            type: mongoose.Types.ObjectId,
            ref: "Request"
        }],
        startingFrom: {
            type: Date
        },
        endingAt: {
            type: Date
        },
        designation: {
            type: String,
            enum: designationsEnums,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);


/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
