import express from "express";
import { deleteAccountByIdFc, login, register } from '../controllers/authentication'
import { isAuthenticated } from "../middlewares/isAuthenticated";

export default (router: express.Router) =>{
    router.post('/auth/register', register);
    router.post('/auth/login', login);

    router.delete('/users/:id', isAuthenticated, deleteAccountByIdFc);

}
