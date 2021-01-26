const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cookieParser());
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

const api = require('./routes/api/api');

app.use('/api/', api);
app.set('trust proxy', 1)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

