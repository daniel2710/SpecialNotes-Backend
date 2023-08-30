"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSpaceModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WorkSpaceSchema = new mongoose_1.default.Schema({
    name: { type: String, default: 'My workspace', required: true },
    description: { type: String, default: 'My workspace' },
    theme: { type: String, default: 'light', enum: ["dark", "light"] },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
exports.WorkSpaceModel = mongoose_1.default.model("WorkSpace", WorkSpaceSchema);
