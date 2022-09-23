const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/addProfileInfo', auth(), validate(userValidation.addProfileInfo), userController.updateUser);

router.get('/getTopMentors', userController.getTopMentors);

router.get('/getMentorsInYourCity', userController.getMentorsInYourCity);

router.get('/getMentors', userController.getMentors);

router.get('/getMentees', userController.getMentees);
// router
//   .route('/')
//   .post(auth(), validate(userValidation.createUser), userController.createUser)
//   .get(auth(), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
