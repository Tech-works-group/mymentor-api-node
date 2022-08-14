const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postController = require('../../controllers/post.controller');

const router = express.Router();

/// TODO: add validations like user validation

router.post('/createOpportunity', auth(), postController.createOpportunity);
router.post('/createComment', auth(), postController.createComment);
router.post('/createReply', auth(), postController.createReply);
router.post('/createMentoringRequest', auth(), postController.createMentoringRequest);
router.post('/deletePost', auth(), postController.deletePost);
router.post('/deleteComment', auth(), postController.deleteComment);
router.post('/deleteRequest', auth(), postController.deleteRequest);
router.post('/deleteReply', auth(), postController.deleteReply);
router.post('/createRequest', auth(), postController.createRequest);
router.get('/getRecentOpportunities', postController.getRecentOpportunities);
router.get('/getRecentMentoringRequests', postController.getRecentMentoringRequests);
router.get('/getRequestsForMyPosts', auth(), postController.getRequestsForMyPosts);
router.post('/requestParticipation', auth(), postController.requestParticipation);
router.get('/getMentoringOpportunities', postController.getMentoringOpportunities);
router.get('/getMentoringRequests', postController.getMentoringRequests);
router.post('/approveRequest', auth(), postController.approveRequest);
router.post('/rejectRequest', auth(), postController.rejectRequest);
router.post('/changePostStatus', auth(), postController.changePostStatus);
router.get('/search', postController.search);

module.exports = router;
