"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settingsNotes_1 = require("./settingsNotes");
const NotesSchema = new mongoose_1.default.Schema({
    workSpaceId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'WorkSpace' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    settings: { type: settingsNotes_1.settingsNotesSchema, required: false },
    createdAt: { type: Date, default: Date.now }
});
exports.NotesModel = mongoose_1.default.model("Notes", NotesSchema);
