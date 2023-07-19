import express from "express";
import { getAllNotes, getNoteByIdFc, createNoteFc, deleteNoteByIdFc } from "../controllers/notes";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export default (router: express.Router) =>{
    router.get('/notes', isAuthenticated, getAllNotes);
    router.get('/notes/:id', isAuthenticated, getNoteByIdFc);

    router.post('/notes', isAuthenticated, createNoteFc)

    router.delete('/notes/:id', isAuthenticated, deleteNoteByIdFc)
}   