const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const compression = require('compression')
const http = require('http');
const Ddos = require('ddos');
const helmet = require('helmet');
const api = require('./routes/api/api');
const ddos = new Ddos({ burst:50, limit:50 })
const corsConfig = {
  origin: true,
  credentials: true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.enable('trust proxy');
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(ddos.express);
app.use(compression());
app.use('/api/', api);


if (process.env.NODE_ENV == 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next();
  }
});
  // static folder
  app.use(express.static(__dirname + '/public/'));

  // handle spa
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));  
}

app.use(express.static('public'));
const port = process.env.PORT || 5000;

http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + app.get('port'));
});

