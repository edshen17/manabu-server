const jwt = require('jsonwebtoken');
const config = require('../../../config/auth.config');

function verifyToken(req, res, next) {
  if ((req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig)) { //req contains the header (prevent csrf attacks) and is from client
    const token = req.cookies.hp + req.cookies.sig;
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes  
      req.userId = decoded.id;
      req.role = decoded.role;
    });

  } else {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  next();
}





module.exports = verifyToken;