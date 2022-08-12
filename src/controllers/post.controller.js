const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post.model')
const Request = require('../models/request.model')
const ApiError = require('../utils/ApiError');

const createOpportunity = catchAsync(async (req, res) => {
    const { user } = req;
    if (user.userType !== 'mentor') {
        res.status(httpStatus.FORBIDDEN).send('only mentors can create opportunity')
        return;
    }
    const { title, description, certificate, isPaid, amount, location, address, duration, hiring, responsibilities, requirements, outcomes, startingFrom, endingAt, designation } = req.body;
    const post = await Post.create({ title, description, certificate, isPaid, amount, location, address, duration, hiring, responsibilities, requirements, outcomes, designation, startingFrom, endingAt, createdBy: user, status: 'open', postType: "opportunity" })
    res.send(post)
});

const createMentoringRequest = catchAsync(async (req, res) => {
    const { user } = req;
    if (user.userType !== 'mentee') {
        res.status(httpStatus.FORBIDDEN).send('only mentees can create mentoring requests')
        return
    }
    const { title, description, isPaid, amount, location, address, duration, experience, background, requirements, tasks, startingFrom, endingAt, designation } = req.body;
    const post = await Post.create({ title, description, isPaid, amount, location, address, duration, experience, background, tasks, requirements, startingFrom, endingAt, designation, createdBy: user, status: 'open', postType: "request" })
    res.send(post)
});

const deletePost = async (req, res) => {
    const { user } = req;
    const { postId } = req.body;
    const post = await Post.findOne({ _id: postId });

    if (!post) {
        res.status(httpStatus.NOT_FOUND).send('Post not found')
        return
    }

    if (String(post.createdBy) !== String(user.id)) {
        console.log(post.createdBy, user.id)
        res.status(httpStatus.FORBIDDEN).send('Only owner can delete')
        return
    }

    await post.remove();

    res.send(post);
};

const createRequest = async (req, res) => {
    const { user } = req;
    const { postId } = req.body
    const post = await Post.findById(postId)

    if (!post) {
        res.status(httpStatus.NOT_FOUND).send('Post not found')
        return
    }

    const request = await Request.create({
        status: "pending",
        createdBy: user._id,
        post: postId
    });

    post.requests.push(request)
    post.save();
    res.send(request)
}

const getRecentOpportunities = async (req, res) => {
    const recent = await Post.find({ postType: 'opportunity' }, null, {
        sort: {
            createdAt: -1
        },
        limit: 2
    });

    res.send(recent)

}


const getRecentMentoringRequests = async (req, res) => {
    const recent = await Post.find({ postType: 'request' }, null, {
        sort: {
            createdAt: -1
        },
        limit: 2
    });

    res.send(recent);
}

module.exports = {
    createOpportunity,
    createMentoringRequest,
    deletePost,
    createRequest,
    getRecentOpportunities,
    getRecentMentoringRequests
};
