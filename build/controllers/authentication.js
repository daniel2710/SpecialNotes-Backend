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
exports.deleteAccountByIdFc = exports.register = exports.login = void 0;
const user_1 = require("../methods/user");
const helpers_1 = require("../helpers");
const notes_1 = require("../methods/notes");
const workspaces_1 = require("../methods/workspaces");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).json({ status: 'failed', message: `username is required` });
        }
        else if (!password) {
            return res.status(400).json({ status: 'failed', message: `password is required` });
        }
        const user = yield (0, user_1.getUserByUsername)(username).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).json({ status: 'failed', message: `user does not exist` });
        }
        const expectedHash = (0, helpers_1.authentication)((_a = user.authentication) === null || _a === void 0 ? void 0 : _a.salt, password);
        if (((_b = user.authentication) === null || _b === void 0 ? void 0 : _b.password) !== expectedHash) {
            return res.status(400).json({ status: 'failed', message: 'Incorrect password' });
        }
        const salt = (0, helpers_1.randomToken)();
        user.authentication.sessionToken = (0, helpers_1.authentication)(salt, user._id.toString());
        yield user.save();
        res.cookie('SPECIALNOTES-AUTH', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/'
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastname, birthday, username, email, password } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'failed', message: `name is required` });
        }
        else if (!lastname) {
            return res.status(400).json({ status: 'failed', message: `lastname is required` });
        }
        else if (!username) {
            return res.status(400).json({ status: 'failed', message: `username is required` });
        }
        else if (!password) {
            return res.status(400).json({ status: 'failed', message: `password is required` });
        }
        const existingUserByUsername = yield (0, user_1.getUserByUsername)(username);
        // const existingUserByEmail = await getUserByEmail(email)
        // if(existingUserByEmail) {
        //     return res.status(400).json({ status: 'failed', message: 'User already exists'});
        // }
        if (existingUserByUsername) {
            return res.status(400).json({ status: 'failed', message: 'Username in use' });
        }
        const salt = (0, helpers_1.randomToken)();
        yield (0, user_1.createUser)({
            name,
            lastname,
            birthday,
            username,
            email,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password)
            }
        });
        return res.status(200).json({
            status: 'Success',
            message: 'User created successfully',
            user: {
                name, lastname, username,
                authentication: {
                    salt
                }
            }
        }).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.register = register;
const deleteAccountByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, notes_1.deleteNotesByUserId)(id);
        const deletedUser = yield (0, user_1.deleteUserById)(id);
        const deletedWorkspace = yield (0, workspaces_1.deleteWorkSpaceByCreatedBy)(id);
        if (deletedUser && deletedWorkspace) {
            return res.status(200).json({ status: 'success', deletedUser, deletedWorkspace });
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
exports.deleteAccountByIdFc = deleteAccountByIdFc;
