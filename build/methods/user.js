"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserBySessionToken = exports.getUserById = exports.getUserByUsername = exports.getUserByEmail = exports.getUsers = void 0;
const users_1 = require("../schemas/users");
const workspace_1 = require("../schemas/workspace");
const getUsers = () => {
    return users_1.UserModel.find();
};
exports.getUsers = getUsers;
const getUserByEmail = (email) => {
    return users_1.UserModel.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const getUserByUsername = (username) => {
    return users_1.UserModel.findOne({ username });
};
exports.getUserByUsername = getUserByUsername;
const getUserById = (id) => {
    return users_1.UserModel.findById(id);
};
exports.getUserById = getUserById;
const getUserBySessionToken = (sessionToken) => {
    return users_1.UserModel.findOne({
        'authentication.sessionToken': sessionToken
    });
};
exports.getUserBySessionToken = getUserBySessionToken;
const createUser = (values) => {
    const newWorkspaceData = {
        name: 'My workspace',
        description: 'My workspace',
        theme: 'light',
        createdBy: {}
    };
    return new users_1.UserModel(values).save()
        .then((user) => {
        newWorkspaceData.createdBy = user._id;
        const newWorkspace = new workspace_1.WorkSpaceModel(newWorkspaceData);
        values.workspace = newWorkspace._id;
        return newWorkspace.save();
    })
        .catch((error) => {
        throw new Error(`Error al crear usuario y espacio de trabajo: ${error}`);
    });
};
exports.createUser = createUser;
const deleteUserById = (id) => {
    return users_1.UserModel.findOneAndDelete({ _id: id });
};
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => {
    return users_1.UserModel.findByIdAndUpdate(id, values);
};
exports.updateUserById = updateUserById;
