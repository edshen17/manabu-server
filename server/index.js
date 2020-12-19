const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))

const api = require('./routes/api/api');

app.use('/api/', api);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

