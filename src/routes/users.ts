import express from "express";
import { getAllUsers, getUserByEmailFc, getUserByIdFc, getUserByUsernameFc, updateUserByIdFc, getUserBySessionTokenFc } from "../controllers/users";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export default (router: express.Router) =>{
    router.get('/users', isAuthenticated, getAllUsers);
    router.get('/users/:id', isAuthenticated, getUserByIdFc);
    router.get('/users/username/:username', isAuthenticated, getUserByUsernameFc);
    router.get('/users/email/:email', isAuthenticated, getUserByEmailFc);
    router.get('/users/token/:sessionToken', getUserBySessionTokenFc);

    router.put('/users/:id', isAuthenticated, updateUserByIdFc);
}   