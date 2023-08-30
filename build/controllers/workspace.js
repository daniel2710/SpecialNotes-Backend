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
exports.updateWorkSpaceById = exports.deleteWorkSpaceByCreatedByFc = exports.getWorkSpaceByCreatedByFc = exports.getWorkSpaceByIdFc = exports.getAllWorkSpaces = void 0;
const workspaces_1 = require("../methods/workspaces");
const pagination_1 = require("../helpers/pagination");
const workspace_1 = require("../enums/workspace");
const getAllWorkSpaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    try {
        const workspaces = yield (0, workspaces_1.getWorkSpaces)();
        const paginatedResult = (0, pagination_1.paginate)(workspaces, currentPage, limit, 'workspaces');
        const response = {
            status: 'success',
            workspaces: paginatedResult.results,
            current_page: currentPage,
            total_pages: paginatedResult.totalPages,
            next: paginatedResult.hasNextPage,
            previous: paginatedResult.hasPreviousPage,
            total_items: paginatedResult.totalItems,
            items_on_page: paginatedResult.results.length,
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
exports.getAllWorkSpaces = getAllWorkSpaces;
const getWorkSpaceByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workSpaceId = req.params.id;
        const workSpace = yield (0, workspaces_1.getWorkSpaceById)(workSpaceId);
        if (workSpace) {
            return res.status(200).json({ status: 'success', workSpace });
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
exports.getWorkSpaceByIdFc = getWorkSpaceByIdFc;
const getWorkSpaceByCreatedByFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.createdBy;
        const workSpace = yield (0, workspaces_1.getWorkSpaceByCreatedBy)(userId);
        if (workSpace) {
            return res.status(200).json({ status: 'success', workSpace });
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
exports.getWorkSpaceByCreatedByFc = getWorkSpaceByCreatedByFc;
const deleteWorkSpaceByCreatedByFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { createdBy } = req.params;
        const deletedWorkSpace = yield (0, workspaces_1.deleteWorkSpaceByCreatedBy)(createdBy);
        if (deletedWorkSpace) {
            return res.status(200).json({ status: 'success', deletedWorkSpace });
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
exports.deleteWorkSpaceByCreatedByFc = deleteWorkSpaceByCreatedByFc;
const updateWorkSpaceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedWorkSpaceData = req.body;
        const workspace = yield (0, workspaces_1.getWorkSpaceById)(id);
        if (workspace) {
            if (updatedWorkSpaceData.name) {
                workspace.name = updatedWorkSpaceData.name;
            }
            if (updatedWorkSpaceData.description) {
                workspace.description = updatedWorkSpaceData.description;
            }
            if (updatedWorkSpaceData.theme) {
                if (updatedWorkSpaceData.theme in workspace_1.enumTheme) {
                    workspace.theme = updatedWorkSpaceData.theme;
                }
                else {
                    return res.status(400).json({ status: 'failed', message: 'theme not found' });
                }
            }
            yield workspace.save();
            return res.status(200).json(workspace).end();
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
exports.updateWorkSpaceById = updateWorkSpaceById;
