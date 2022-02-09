"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '.env' });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const http_1 = __importDefault(require("http"));
const dbConnectionHandler_1 = require("./components/dataAccess/utils/dbConnectionHandler");
const schedulers_1 = require("./components/schedulers");
const constants_1 = require("./constants");
const api_1 = require("./routes/api");
const verifyTokenMiddleware_1 = require("./routes/middleware/verifyTokenMiddleware");
const app = (0, express_1.default)();
const corsConfig = {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
let dbConnectionHandler;
let scheduler;
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, hpp_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsConfig));
app.enable('trust proxy');
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, compression_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.all('*', verifyTokenMiddleware_1.verifyToken);
app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
app.use('/api/', api_1.v1);
if (constants_1.IS_PRODUCTION) {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        }
        else {
            next();
        }
    });
    // static folder
    app.use(express_1.default.static(__dirname + '/public/'));
    // handle spa
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
app.use(express_1.default.static('public'));
const port = 5000;
(async () => {
    dbConnectionHandler = await dbConnectionHandler_1.makeDbConnectionHandler;
    scheduler = await schedulers_1.makeScheduler;
    await dbConnectionHandler.connect();
    await scheduler.start();
})();
const gracefulShutdown = async (msg, callback) => {
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
http_1.default.createServer(app).listen(port, function () {
    console.log(`Express server listening on port ${port}`);
});
