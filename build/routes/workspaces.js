"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_1 = require("../controllers/workspace");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
exports.default = (router) => {
    router.get('/workspaces', isAuthenticated_1.isAuthenticated, workspace_1.getAllWorkSpaces);
    router.get('/workspaces/:id', isAuthenticated_1.isAuthenticated, workspace_1.getWorkSpaceByIdFc);
    router.get('/workspaces/createdBy/:createdBy', isAuthenticated_1.isAuthenticated, workspace_1.getWorkSpaceByCreatedByFc);
    router.patch('/workspaces/:id', isAuthenticated_1.isAuthenticated, workspace_1.updateWorkSpaceById);
    router.delete('/workspaces/createdBy/:createdBy', isAuthenticated_1.isAuthenticated, workspace_1.deleteWorkSpaceByCreatedByFc);
};
