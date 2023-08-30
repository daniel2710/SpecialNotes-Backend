"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("./authentication"));
const users_1 = __importDefault(require("./users"));
const workspaces_1 = __importDefault(require("./workspaces"));
const notes_1 = __importDefault(require("./notes"));
const routes = express_1.default.Router();
exports.default = () => {
    (0, authentication_1.default)(routes);
    (0, users_1.default)(routes);
    (0, workspaces_1.default)(routes);
    (0, notes_1.default)(routes);
    return routes;
};
