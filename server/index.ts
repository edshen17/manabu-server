require('dotenv').config({ path: '.env' });
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { makeDbConnectionHandler } from './components/dataAccess/utils/dbConnectionHandler';
import { v1 } from './routes/api';
import { verifyToken } from './routes/middleware/verifyTokenMiddleware';

const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(hpp());
app.use(cookieParser());
app.use(cors(corsConfig));
app.enable('trust proxy');
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(mongoSanitize());
app.all('*', verifyToken);
app.use('/api/', v1);

if (process.env.NODE_ENV == 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
  // static folder
  app.use(express.static(__dirname + '/public/'));

  // handle spa
  app.get(/.*/, (req: Request, res: Response) => res.sendFile(__dirname + '/public/index.html'));
}

app.use(express.static('public'));
const port = process.env.PORT || 5000;

http.createServer(app).listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});

makeDbConnectionHandler.then(async (dbConnectionHandler) => {
  await dbConnectionHandler.connect();
});
