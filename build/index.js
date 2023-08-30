"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const connection_1 = __importDefault(require("./db/connection"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./middlewares/logger"));
dotenv_1.default.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
exports.URL = 'https://specialnotesback.onrender.com';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['https://special-notes-frontend.vercel.app', 'https://specialnotesback.onrender.com']
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(logger_1.default);
(0, connection_1.default)();
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log("server listening on https://specialnotesback.onrender.com");
});
app.use('/', (0, routes_1.default)());
