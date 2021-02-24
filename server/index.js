const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const compression = require('compression')
const http = require('http');

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
app.enable('trust proxy');

app.use(compression());

const api = require('./routes/api/api');

app.use('/api/', api);


if (process.env.NODE_ENV == 'production') {
  // static folder
  app.use(express.static(__dirname + '/public/'));

  // handle spa
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

  app.use(function(req, res, next) {
    if (req.secure){
        return next();
    }
    res.redirect("https://" + req.headers.host + req.url);
  });
}

const port = process.env.PORT || 5000;

http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + app.get('port'));
});

