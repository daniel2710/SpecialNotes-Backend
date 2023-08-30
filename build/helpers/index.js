"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.randomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const SECRET_KEY = process.env.SECRET_KEY;
const randomToken = () => {
    return crypto_1.default.randomBytes(128).toString('base64');
};
exports.randomToken = randomToken;
const authentication = (salt, password) => {
    if (SECRET_KEY) {
        return crypto_1.default.createHmac('sha256', [salt, password].join('/')).update(SECRET_KEY).digest('hex');
    }
    return null;
};
exports.authentication = authentication;
