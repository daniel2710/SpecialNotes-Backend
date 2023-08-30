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
exports.getUserBySessionTokenFc = exports.updateUserByIdFc = exports.getUserByEmailFc = exports.getUserByUsernameFc = exports.getUserByIdFc = exports.getAllUsers = void 0;
const user_1 = require("../methods/user");
const pagination_1 = require("../helpers/pagination");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    try {
        const users = yield (0, user_1.getUsers)();
        const paginatedResult = (0, pagination_1.paginate)(users, currentPage, limit, 'users');
        const response = {
            status: 'success',
            users: paginatedResult.results,
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
exports.getAllUsers = getAllUsers;
const getUserByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield (0, user_1.getUserById)(userId);
        if (user) {
            return res.status(200).json({ status: 'success', user });
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
exports.getUserByIdFc = getUserByIdFc;
const getUserByUsernameFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const user = yield (0, user_1.getUserByUsername)(username);
        if (user) {
            return res.status(200).json({ status: 'success', user });
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
exports.getUserByUsernameFc = getUserByUsernameFc;
const getUserByEmailFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const user = yield (0, user_1.getUserByEmail)(email);
        if (user) {
            return res.status(200).json({ status: 'success', user });
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
exports.getUserByEmailFc = getUserByEmailFc;
const updateUserByIdFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, lastname, username, } = req.body;
        if (!username) {
            return res.status(400).json({ status: 'failed', message: 'Username is required' });
        }
        else if (!name) {
            return res.status(400).json({ status: 'failed', message: 'Name is required' });
        }
        else if (!lastname) {
            return res.status(400).json({ status: 'failed', message: 'Lastname is required' });
        }
        const user = yield (0, user_1.getUserById)(id);
        if (user) {
            user.name = name;
            user.lastname = lastname;
            user.username = username;
            yield user.save();
        }
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateUserByIdFc = updateUserByIdFc;
const getUserBySessionTokenFc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.params.sessionToken;
        const user = yield (0, user_1.getUserBySessionToken)(sessionToken);
        if (user) {
            return res.status(200).json({ status: 'success', user });
        }
        else {
            return res.sendStatus(400);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.getUserBySessionTokenFc = getUserBySessionTokenFc;
