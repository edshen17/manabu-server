const jwt = require('jsonwebtoken');
const handleErrors = require('../components/controllers/errorHandler');
const verifyToken = (req, res, next) => {
  if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) {
    //req contains the header (prevent csrf attacks) and is from client
    const token = req.cookies.hp + req.cookies.sig;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) return next(err);
      if (decoded) {
        req.userId = decoded._id;
        req.role = decoded.role || 'user';
        req.isVerified = true;
      }
    });
  } else {
    req.isVerified = false;
  }

  next();
};

module.exports = verifyToken;
