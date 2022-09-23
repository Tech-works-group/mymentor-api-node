const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post.model');
const Request = require('../models/request.model');
const ApiError = require('../utils/ApiError');
const Comment = require('../models/comment.model');
const { http } = require('winston');

const createOpportunity = catchAsync(async (req, res) => {
  const { user } = req;
  if (user.userType !== 'mentor') {
    res.status(httpStatus.FORBIDDEN).send('only mentors can create opportunity');
    return;
  }
  const {
    title,
    description,
    certificate,
    isPaid,
    amount,
    location,
    address,
    duration,
    hiring,
    responsibilities,
    requirements,
    outcomes,
    startingFrom,
    endingAt,
    designation,
  } = req.body;

  const post = await Post.create({
    title,
    description,
    certificate,
    isPaid,
    amount,
    location,
    address,
    duration,
    hiring,
    responsibilities,
    requirements,
    outcomes,
    designation,
    startingFrom,
    endingAt,
    createdBy: user,
    status: 'open',
    postType: 'opportunity',
  });
  res.send(post);
});

const createMentoringRequest = catchAsync(async (req, res) => {
  const { user } = req;
  console.log(user);
  if (user.userType !== 'mentee') {
    res.status(httpStatus.FORBIDDEN).send('only mentees can create mentoring requests');
    return;
  }
  const {
    title,
    description,
    isPaid,
    amount,
    location,
    address,
    duration,
    experience,
    background,
    requirements,
    tasks,
    startingFrom,
    endingAt,
    designation,
  } = req.body;
  const post = await Post.create({
    title,
    description,
    isPaid,
    amount,
    location,
    address,
    duration,
    experience,
    background,
    tasks,
    requirements,
    startingFrom,
    endingAt,
    designation,
    createdBy: user,
    status: 'open',
    postType: 'request',
  });
  res.send(post);
});

const deletePost = async (req, res) => {
  const { user } = req;
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('Post not found');
    return;
  }

  if (String(post.createdBy) !== String(user.id)) {
    console.log(post.createdBy, user.id);
    res.status(httpStatus.FORBIDDEN).send('Only owner can delete');
    return;
  }

  await post.remove();

  res.send(post);
};

const createRequest = async (req, res) => {
  const { user } = req;
  const { postId } = req.body;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('Post not found');
    return;
  }

  const request = await Request.create({
    status: 'pending',
    createdBy: user._id,
    post: postId,
  });

  post.requests.push(request);
  await post.save();
  res.send(request);
};

const getRecentOpportunities = async (req, res) => {
  const recent = await Post.find({ postType: 'opportunity' }, null, {
    sort: {
      createdAt: -1,
    },
    limit: 2,
  });

  res.send(recent);
};

const getRecentMentoringRequests = async (req, res) => {
  const recent = await Post.find({ postType: 'request' }, null, {
    sort: {
      createdAt: -1,
    },
    limit: 2,
  });
  console.log(recent);
  res.send(recent);
};

const requestParticipation = async (req, res) => {
  const { user } = req;
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('Post not found');
    return;
  }
  if (post.postType === 'request' && user.userType === 'mentee') {
    res.status(httpStatus.FORBIDDEN).send('Only mentors can apply for mentoring request');
    return;
  }
  if (post.postType === 'opportunity' && user.userType === 'mentor') {
    res.status(httpStatus.FORBIDDEN).send('Only mentee can apply for mentoring opportunity');
    return;
  }
  const request = await Request.create({ status: 'pending', createdBy: user, post });
  await request.save();

  post.requests.push(request);
  await post.save();
  res.send(post);
};

const getRequestsForMyPosts = async (req, res) => {
  const { user } = req;
  const requests = await Post.find({ createdBy: user.id }).populate({ path: 'requests', populate: 'createdBy' });
  res.send(requests);
};

const getMentoringRequests = async (req, res) => {
  const { skip = 0, limit = 10 } = req.body;
  const mentoringRequests = await Post.find({ postType: 'request' }, null, { skip, limit });
  res.send(mentoringRequests);
};

const getMentoringOpportunities = async (req, res) => {
  const { skip = 0, limit = 10 } = req.body;
  const mentoringOpportunities = await Post.find({ postType: 'opportunity' }, null, { skip, limit });
  res.send(mentoringOpportunities);
};

const createComment = async (req, res) => {
  const { user } = req;
  const { postId, content } = req.body;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('Post not found');
    return;
  }

  const comment = await Comment.create({
    createdBy: user._id,
    post,
    content,
  });

  post.comments.push(comment);

  await post.save();

  res.send(comment);
};

const createReply = async (req, res) => {
  const { user } = req;
  const { postId, content, commentId } = req.body;
  const post = await Post.findById(postId);
  const replyTo = await Comment.findById(commentId);

  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('Post not found');
    return;
  }

  const reply = await Comment.create({
    createdBy: user._id,
    post,
    content,
  });

  replyTo.replies.push(reply);

  await replyTo.save();

  res.send(reply);
};

const approveRequest = async (req, res) => {
  const { requestId } = req.body;

  const request = await Request.findById(requestId);

  request.status = 'approved';

  await request.save();

  res.send(request);
};

const rejectRequest = async (req, res) => {
  const { requestId } = req.body;

  const request = await Request.findById(requestId);

  request.status = 'rejected';

  await request.save();

  res.send(request);
};

const changePostStatus = async (req, res) => {
  const { postId, status } = req.body;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(httpStatus.NOT_FOUND).send('post not found');
    return;
  }

  post.status = status;

  await post.save();

  return post;
};

const deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(httpStatus.NOT_FOUND).send('Comment not found');
      return;
    }

    await Post.updateOne({ id: postId }, { $pull: { comment: comment.id } });
    await comment.remove();
    res.send(true);
  } catch (error) {
    res.send(error);
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findById(requestId);

    if (!request) {
      res.status(httpStatus.NOT).send('Request not found');
      return;
    }

    await Post.updateOne({ id: request.post }, { $pull: { request: request.id } });

    await request.remove();

    res.send(true);
  } catch (error) {
    res.send(error);
  }
};

const deleteReply = async (req, res) => {
  try {
    const { replyId, commentId } = req.body;

    const reply = await Comment.findById(replyId);

    if (!reply) {
      res.status(httpStatus.NOT_FOUND).send('reply not found');
      return;
    }

    await Comment.updateOne({ id: commentId }, { $pull: { replies: reply.id } });

    await reply.remove();

    res.send(true);
  } catch (error) {
    res.send(error);
  }
};

const search = async (req, res) => {
  const { keyword, designation } = req.body;

  const posts = await Post.find({ designation, title: { $regex: keyword, $options: 'i' } });

  const users = await User.find({ designation });

  const mentors = users.filter((user) => user.userType === 'mentor');

  const mentees = users.filter((user) => user.userType === 'mentee');

  res.send({ posts, mentors, mentees });
};

module.exports = {
  createOpportunity,
  createMentoringRequest,
  deletePost,
  createRequest,
  getRecentOpportunities,
  getRecentMentoringRequests,
  getRequestsForMyPosts,
  requestParticipation,
  getMentoringRequests,
  getMentoringOpportunities,
  createComment,
  createReply,
  approveRequest,
  rejectRequest,
  changePostStatus,
  deleteComment,
  deleteRequest,
  deleteReply,
  search,
};
