const jwt = require('jsonwebtoken');
const config = require('../../../config/auth.config');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'] || req.body.token;
  if (!token || token == 'null') return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  jwt.verify(token, config.secret, async function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}





module.exports = verifyToken;