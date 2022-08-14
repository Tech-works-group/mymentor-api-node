const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const User = require('../models/user.model');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getTopMentors = catchAsync(async (req, res) => {
  const topMentor = await User.find({ userType: 'mentor' }, null, {
    limit: 10,
    sort: {
      rating: -1,
    },
  });
  res.send(topMentor);
});

const getMentorsInYourCity = catchAsync(async (req, res) => {
  const { city } = req.body;
  let mentorsInYourCities = [];

  if (city) {
    mentorsInYourCities = await User.find({ userType: 'mentor', city: city }, null, {
      limit: 10,
    });
  } else {
    mentorsInYourCities = await User.find({ userType: 'mentor' }, null, {
      limit: 10,
    });
  }

  res.send(mentorsInYourCities);
});

const getMentors = async (req, res) => {
  const { skip = 0, limit = 10 } = req.body;
  const mentors = await User.find({ userType: 'mentor' }, null, { skip, limit });
  res.send(mentors);
};

const getMentees = async (req, res) => {
  const { skip = 0, limit = 10 } = req.body;
  const mentees = await User.find({ userType: 'mentee' }, null, { skip, limit });
  res.send(mentees);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getTopMentors,
  getMentorsInYourCity,
  getMentors,
  getMentees,
};
