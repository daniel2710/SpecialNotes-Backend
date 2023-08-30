"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: Date, required: false },
    username: { type: String, required: true },
    email: { type: String, required: false },
    authentication: {
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
        password: { type: String, required: true, select: false }
    },
    createdAt: { type: Date, default: Date.now }
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
