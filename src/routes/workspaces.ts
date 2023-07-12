import express from "express";
import { deleteWorkSpaceByCreatedByFc, getAllWorkSpaces, getWorkSpaceByCreatedByFc, getWorkSpaceByIdFc, updateWorkSpaceById } from "../controllers/workspace";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export default (router: express.Router) =>{
    router.get('/workspaces', isAuthenticated, getAllWorkSpaces);
    router.get('/workspaces/:id', isAuthenticated, getWorkSpaceByIdFc);
    router.get('/workspaces/createdBy/:createdBy', isAuthenticated, getWorkSpaceByCreatedByFc);

    router.patch('/workspaces/:id', isAuthenticated, updateWorkSpaceById);

    router.delete('/workspaces/createdBy/:createdBy', isAuthenticated, deleteWorkSpaceByCreatedByFc);

}