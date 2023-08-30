"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkSpaceByCreatedBy = exports.deleteWorkSpaceById = exports.getWorkSpaceByCreatedBy = exports.getWorkSpaceById = exports.getWorkSpaces = void 0;
const workspace_1 = require("../schemas/workspace");
const getWorkSpaces = () => {
    return workspace_1.WorkSpaceModel.find();
};
exports.getWorkSpaces = getWorkSpaces;
const getWorkSpaceById = (id) => {
    return workspace_1.WorkSpaceModel.findById(id);
};
exports.getWorkSpaceById = getWorkSpaceById;
const getWorkSpaceByCreatedBy = (createdBy) => {
    return workspace_1.WorkSpaceModel.findOne({ createdBy });
};
exports.getWorkSpaceByCreatedBy = getWorkSpaceByCreatedBy;
const deleteWorkSpaceById = (id) => {
    return workspace_1.WorkSpaceModel.findOneAndDelete({ _id: id });
};
exports.deleteWorkSpaceById = deleteWorkSpaceById;
const deleteWorkSpaceByCreatedBy = (createdBy) => {
    return workspace_1.WorkSpaceModel.findOneAndDelete({ createdBy });
};
exports.deleteWorkSpaceByCreatedBy = deleteWorkSpaceByCreatedBy;
