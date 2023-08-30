"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notes_1 = require("../controllers/notes");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
exports.default = (router) => {
    router.get('/notes', isAuthenticated_1.isAuthenticated, notes_1.getAllNotes);
    router.get('/notes/:id', isAuthenticated_1.isAuthenticated, notes_1.getNoteByIdFc);
    router.get('/notes/user/:id', isAuthenticated_1.isAuthenticated, notes_1.getNotesByUserToken);
    router.post('/notes', isAuthenticated_1.isAuthenticated, notes_1.createNoteFc);
    router.patch('/notes/:id', isAuthenticated_1.isAuthenticated, notes_1.updateNoteById);
    router.delete('/notes/:id', isAuthenticated_1.isAuthenticated, notes_1.deleteNoteByIdFc);
};
