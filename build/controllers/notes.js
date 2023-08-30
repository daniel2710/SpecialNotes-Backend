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
exports.deleteNoteByIdFc = exports.updateNoteById = exports.createNoteFc = exports.getNoteByIdFc = exports.getNotesByUserToken = exports.getAllNotes = void 0;
const notes_1 = require("../methods/notes");
const pagination_1 = require("../helpers/pagination");
const user_1 = require("../methods/user");
const workspaces_1 = require("../methods/workspaces");
const notes_2 = require("../enums/notes");
const settingsNotes_1 = require("../schemas/settingsNotes");
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || '';
    const activeOnly = req.query['active'] === 'true';
    const archivedOnly = req.query['archived'] === 'true';
    try {
        const notes = yield (0, notes_1.getNotes)();
        let filteredNotes = notes.filter(note => note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase()));
        if (activeOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.active);
        }
        else if (!activeOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.active);
        }
        if (!archivedOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.archived);
        }
        else if (archivedOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.archived);
        }
        const sortedNotes = filteredNotes.sort((a, b) => {
            if (a.settings.pinned && !b.settings.pinned) {
                return -1; // a comes before b
            }
            else if (!a.settings.pinned && b.settings.pinned) {
                return 1; // b comes before a
            }
            else {
                return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by date
            }
        });
        const paginatedResult = (0, pagination_1.paginate)(sortedNotes, currentPage, limit, 'notes');
        const response = {
            status: 'success',
            notes: paginatedResult.results,
            current_page: currentPage,
            total_pages: paginatedResult.totalPages,
            next: paginatedResult.hasNextPage,
            previous: paginatedResult.hasPreviousPage,
            total_items: paginatedResult.totalItems,
            items_on_page: paginatedResult.results.length,
            active_only: activeOnly,
            archived_only: archivedOnly,
        };
        if (paginatedResult.results.length === 0 && currentPage != 1) {
            return res.status(400).json({ status: "failed", message: "There are no results on the current page." });
        }
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.getAllNotes = getAllNotes;
const getNotesByUserToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || '';
    const activeOnly = req.query['active'] === 'true';
    const archivedOnly = req.query['archived'] === 'true';
    try {
        const userId = req.params.id;
        const notes = yield (0, notes_1.getNotesByIdUser)(userId);
        let filteredNotes = notes.filter(note => note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase()));
        if (activeOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.active);
        }
        else if (!activeOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.active);
        }
        if (!archivedOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.archived);
        }
        else if (archivedOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.archived);
        }
        const sortedNotes = filteredNotes.sort((a, b) => {
            if (a.settings.pinned && !b.settings.pinned) {
                return -1; // a comes before b
            }
            else if (!a.settings.pinned && b.settings.pinned) {
                return 1; // b comes before a
            }
            else {
                return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by date
            }
        });
        const paginatedResult = (0, pagination_1.paginate)(sortedNotes, currentPage, limit, 'notes');
        const response = {
            status: 'success',
            notes: paginatedResult.results,
            current_page: currentPage,
            total_pages: paginatedResult.totalPages,
            next: paginatedResult.hasNextPage,
            previous: paginatedResult.hasPreviousPage,
            total_items: paginatedResult.totalItems,
            items_on_page: paginatedResult.results.length,
            active_only: activeOnly,
            archived_only: archivedOnly,
        };
        if (paginatedResult.results.length === 0 && currentPage != 1) {
            return res.status(400).json({ status: "failed", message: "There are no results on the current page." });
        }
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.getNotesByUserToken = getNotesByUserToken;
const getNoteByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.id;
        const note = yield (0, notes_1.getNoteById)(noteId);
        if (note) {
            return res.status(200).json({ status: 'success', note });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.getNoteByIdFc = getNoteByIdFc;
const createNoteFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, settings } = req.body;
        const settingsDefault = new settingsNotes_1.settingsNotesModel();
        const sessionToken = req.cookies['SPECIALNOTES-AUTH'];
        if (!title) {
            return res.status(400).json({ status: 'failed', message: `title is required` });
        }
        else if (!content) {
            return res.status(400).json({ status: 'failed', message: `content is required` });
        }
        if (settings) {
            if (settings.archived) {
                if (typeof settings.archived !== 'boolean') {
                    return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (archived)' });
                }
            }
            if (settings.pinned) {
                if (typeof settings.pinned !== 'boolean') {
                    return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (pinned)' });
                }
            }
            if (settings.backgroundColor) {
                if (!(settings.backgroundColor in notes_2.enumBackgroundColor)) {
                    return res.status(400).json({ status: 'failed', message: `BackgroundColor '${settings.backgroundColor}' value is not allowed` });
                }
            }
        }
        const user = yield (0, user_1.getUserBySessionToken)(sessionToken);
        const workSpace = yield (0, workspaces_1.getWorkSpaceByCreatedBy)(String(user === null || user === void 0 ? void 0 : user._id));
        if (settings) {
            const note = yield (0, notes_1.createNote)({
                userId: user === null || user === void 0 ? void 0 : user._id,
                workSpaceId: workSpace === null || workSpace === void 0 ? void 0 : workSpace._id,
                title,
                content,
                settings
            });
            return res.status(200).json({
                status: 'Success',
                message: 'Note created successfully',
                note
            }).end();
        }
        else {
            const note = yield (0, notes_1.createNote)({
                userId: user === null || user === void 0 ? void 0 : user._id,
                workSpaceId: workSpace === null || workSpace === void 0 ? void 0 : workSpace._id,
                title,
                content,
                settings: settingsDefault
            });
            return res.status(200).json({
                status: 'Success',
                message: 'Note created successfully',
                note
            }).end();
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createNoteFc = createNoteFc;
const updateNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, content, settings } = req.body;
        const note = yield (0, notes_1.getNoteById)(id);
        if (note) {
            if (title) {
                note.title = title;
            }
            if (content) {
                note.content = content;
            }
            if (settings) {
                if (settings.hasOwnProperty('archived')) {
                    if (typeof settings.archived === 'boolean') {
                        note.settings.archived = settings.archived;
                    }
                    else {
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (archived)' });
                    }
                }
                if (settings.hasOwnProperty('pinned')) {
                    if (typeof settings.pinned === 'boolean') {
                        note.settings.pinned = settings.pinned;
                    }
                    else {
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (pinned)' });
                    }
                }
                if (settings.hasOwnProperty('active')) {
                    if (typeof settings.active === 'boolean') {
                        note.settings.active = settings.active;
                    }
                    else {
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (active)' });
                    }
                }
                if (settings.backgroundColor) {
                    if (settings.backgroundColor in notes_2.enumBackgroundColor) {
                        note.settings.backgroundColor = settings.backgroundColor;
                    }
                    else {
                        return res.status(400).json({ status: 'failed', message: `BackgroundColor '${settings.backgroundColor}' value is not allowed` });
                    }
                }
            }
            yield note.save();
            return res.status(200).json(note).end();
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateNoteById = updateNoteById;
const deleteNoteByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedNote = yield (0, notes_1.deleteNoteById)(id);
        if (deletedNote) {
            return res.status(200).json({ status: 'success', deletedNote });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.deleteNoteByIdFc = deleteNoteByIdFc;
