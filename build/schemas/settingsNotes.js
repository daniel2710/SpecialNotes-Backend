"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsNotesModel = exports.settingsNotesSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.settingsNotesSchema = new mongoose_1.default.Schema({
    active: { type: Boolean, required: false, default: true },
    archived: { type: Boolean, required: false, default: false },
    pinned: { type: Boolean, required: false, default: false },
    backgroundColor: { type: String, default: 'rich-black', enum: ["rich-black", "cherry-red", "cliff-blue", "qahvei-brown"] },
});
exports.settingsNotesModel = mongoose_1.default.model("settingsNotes", exports.settingsNotesSchema);
