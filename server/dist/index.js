"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
//@ts-ignore
const cors_1 = __importDefault(require("cors"));
//@ts-ignore
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//@ts-ignore
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
//@ts-ignore
const ddos_1 = __importDefault(require("ddos"));
const helmet_1 = __importDefault(require("helmet"));
//@ts-ignore
const api_1 = __importDefault(require("./routes/api/api"));
const app = express_1.default();
const ddos = new ddos_1.default({ burst: 50, limit: 50 });
const corsConfig = {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
// Middleware
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(cors_1.default(corsConfig));
app.options('*', cors_1.default(corsConfig));
app.enable('trust proxy');
app.use(helmet_1.default({
    contentSecurityPolicy: false,
}));
app.use(ddos.express);
app.use(compression_1.default());
app.use('/api/', api_1.default);
if (process.env.NODE_ENV == 'production') {
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
const port = process.env.PORT || 5000;
http_1.default.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + app.get('port'));
});
