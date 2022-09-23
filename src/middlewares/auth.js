// const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../services/token.service');
// const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
//   const token = req.cookies[COOKIE.access];
//   if (err || info || !user) {
//     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//   }

//   req.user = user;

//   resolve();
// };

const auth = () => async (req, res, next) => {
  // return new Promise((resolve, reject) => {
  //   passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  // })
  //   .then(() => next())
  //   .catch((err) => next(err));
};

 function Authenticate() {
  return async function (req, res, next) {
    const jwtString = req.cookies.access;
    const user = await verifyToken(jwtString, 'access');
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }
    req.user = user;
    next();
  };
}

module.exports = Authenticate;
