const axios = require('axios')

// ensure server has access to updated roles
async function verifyRole(req, res, next) {
  const token = req.headers['x-access-token'];
  const resObj = await axios.get('http://localhost:5000/api/me', { headers: {
        'x-access-token': token,
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      } 
    }).catch((err) => console.log(err));

    req.role = resObj.data.role;
    next();
}





module.exports = verifyRole;