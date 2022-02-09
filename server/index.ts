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
import { DbConnectionHandler } from './components/dataAccess/utils/dbConnectionHandler/dbConnectionHandler';
import { makeScheduler } from './components/schedulers';
import { Scheduler } from './components/schedulers/scheduler';
import { IS_PRODUCTION } from './constants';
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
let dbConnectionHandler: DbConnectionHandler;
let scheduler: Scheduler;

// Middleware
app.use(express.urlencoded({ extended: true }));
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
app.use(
  express.json({
    verify: (req, res, buffer) => ((req as any)['rawBody'] = buffer),
  })
);
app.use('/api/', v1);

if (IS_PRODUCTION) {
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

(async () => {
  dbConnectionHandler = await makeDbConnectionHandler;
  scheduler = await makeScheduler;
  await dbConnectionHandler.connect();
  await scheduler.start();
})();

const gracefulShutdown = async (msg: string, callback: () => unknown) => {
  await dbConnectionHandler.stop();
  await scheduler.stop();
  console.log(`Mongoose disconnected through ${msg}`);
  callback();
};

process.on('SIGINT', async () => {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  gracefulShutdown('Heroku app termination', function () {
    process.exit(0);
  });
});

http.createServer(app).listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});
