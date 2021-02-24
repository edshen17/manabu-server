const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const compression = require('compression')

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


app.use(compression());

const api = require('./routes/api/api');

app.use('/api/', api);
app.set('trust proxy', 1)

if (process.env.NODE_ENV == 'production') {
  // static folder
  app.use(express.static(__dirname + '/public/'));

  // handle spa
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

  app.use(function(req, res, next) {
    if (req.headers["x-forwarded-proto"] === "https"){
        return next();
    }
    res.redirect("https://" + req.headers.host + req.url);
    next();
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

