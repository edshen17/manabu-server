const axios = require('axios')

// ensure server has access to updated roles (prevent stale tokens).
function verifyRole(req, res, next) {
  axios.get('http://localhost:5000/api').then((res) => {
  console.log(res);
}).catch((err) => {console.log(err)})
  // const resObj = await axios.get('http://localhost:5000/api/me', { headers: {
  //       'X-Requested-With': 'XMLHttpRequest'
  //     } 
  //   }).then((res) => {
  //     console.log(res.data);
  //     req.role = res.data.role;
  //   }).catch((err) => {});

    
    next();
}

module.exports = verifyRole;