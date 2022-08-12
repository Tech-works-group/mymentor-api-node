const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postController = require('../../controllers/post.controller');

const router = express.Router();

/// TODO: add validations like user validation

router.post('/createOpportunity', auth(), postController.createOpportunity);
router.post('/createMentoringRequest', auth(), postController.createMentoringRequest);
router.post('/deletePost', auth(), postController.deletePost);
router.post('/createRequest', auth(), postController.createRequest);
router.get('/getRecentOpportunities', postController.getRecentOpportunities);
router.get('/getRecentMentoringRequests', postController.getRecentMentoringRequests);

// router.post('/createOpportunity', auth(), validate(userValidation.addProfileInfo), postController.createOpportunity);


module.exports = router;
