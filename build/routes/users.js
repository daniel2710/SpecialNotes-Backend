"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
exports.default = (router) => {
    router.get('/users', isAuthenticated_1.isAuthenticated, users_1.getAllUsers);
    router.get('/users/:id', isAuthenticated_1.isAuthenticated, users_1.getUserByIdFc);
    router.get('/users/username/:username', isAuthenticated_1.isAuthenticated, users_1.getUserByUsernameFc);
    router.get('/users/email/:email', isAuthenticated_1.isAuthenticated, users_1.getUserByEmailFc);
    router.get('/users/token/:sessionToken', users_1.getUserBySessionTokenFc);
    router.put('/users/:id', isAuthenticated_1.isAuthenticated, users_1.updateUserByIdFc);
};
