const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const User = require('../models/User');
const handleErrors = require('../scripts/controller/errorHandler')

const verifyToken = (req, res, next) => {
  if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) { //req contains the header (prevent csrf attacks) and is from client
    const token = req.cookies.hp + req.cookies.sig;
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) return next(err);
      // if everything good, save to request for use in other routes  
      req.userId = decoded.id;
      req.role = decoded.role;
      User.findOneAndUpdate({ // update online
        _id: req.params.uId
      }, { lastOnline: new Date() }).catch((err) => { console.log(err) });
      // res.cookie('hp', req.cookies.hp, { expires: new Date(Date.now() + 30 * 60 * 1000), httpOnly: true }) // extend hp cookie life by 30m
    });
  }

  next();
}





module.exports = verifyToken;