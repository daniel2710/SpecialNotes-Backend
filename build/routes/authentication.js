"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
exports.default = (router) => {
    router.post('/auth/register', authentication_1.register);
    router.post('/auth/login', authentication_1.login);
    router.delete('/users/:id', isAuthenticated_1.isAuthenticated, authentication_1.deleteAccountByIdFc);
};
