"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotesByUserId = exports.deleteNoteById = exports.createNote = exports.getNoteById = exports.getNotesByIdUser = exports.getNotes = void 0;
const notes_1 = require("../schemas/notes");
const getNotes = () => {
    return notes_1.NotesModel.find();
};
exports.getNotes = getNotes;
const getNotesByIdUser = (id) => {
    return notes_1.NotesModel.find({ userId: id });
};
exports.getNotesByIdUser = getNotesByIdUser;
const getNoteById = (id) => {
    return notes_1.NotesModel.findById(id);
};
exports.getNoteById = getNoteById;
const createNote = (values) => {
    return new notes_1.NotesModel(values).save();
};
exports.createNote = createNote;
const deleteNoteById = (id) => {
    return notes_1.NotesModel.findOneAndDelete({ _id: id });
};
exports.deleteNoteById = deleteNoteById;
const deleteNotesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notes_1.NotesModel.deleteMany({ userId });
});
exports.deleteNotesByUserId = deleteNotesByUserId;
