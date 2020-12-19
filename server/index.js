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


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

