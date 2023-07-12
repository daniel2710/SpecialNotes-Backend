import express from "express";
import { deleteUserByIdFc, getAllUsers, getUserByEmailFc, getUserByIdFc, getUserByUsernameFc, updateUserByIdFc } from "../controllers/users";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export default (router: express.Router) =>{
    router.get('/users', isAuthenticated, getAllUsers);
    router.get('/users/:id', isAuthenticated, getUserByIdFc);
    router.get('/users/username/:username', isAuthenticated, getUserByUsernameFc);
    router.get('/users/email/:email', isAuthenticated, getUserByEmailFc);

    router.put('/users/:id', isAuthenticated, updateUserByIdFc);

    router.delete('/users/:id', isAuthenticated, deleteUserByIdFc);
}   