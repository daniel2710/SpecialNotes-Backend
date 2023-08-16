import express from 'express'
import { createNote, deleteNoteById, getNoteById, getNotes } from '../methods/notes';
import { paginate } from '../helpers/pagination';
import { settingsNotesModel } from '../schemas/settingsNotes';
import { getUserBySessionToken } from '../methods/user';
import { getWorkSpaceByCreatedBy } from '../methods/workspaces';
import { enumBackgroundColor } from '../enums/notes';

export const getAllNotes = async (req: express.Request, res: express.Response) => {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;

    try {
        const notes = await getNotes();
        const paginatedResult = paginate(notes, currentPage, limit, 'notes');
    
        const response = {
          status: 'success',
          notes: paginatedResult.results,
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
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getNoteByIdFc = async (req: express.Request, res: express.Response) =>{
    try {
        const noteId = req.params.id; 
        const note = await getNoteById(noteId); 
        if(note){
            return res.status(200).json({ status: 'success', note }); 
        }else{
            return res.sendStatus(404);   
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const createNoteFc = async (req: express.Request, res: express.Response) =>{
    try {
        const { title, content } = req.body;
        const settings = new settingsNotesModel();
        const sessionToken = req.cookies['SPECIALNOTES-AUTH']

        if(!title){
            return res.status(400).json({ status: 'failed', message: `title is required` });
        }else if(!content){
            return res.status(400).json({ status: 'failed', message: `content is required` });
        }

        const user = await getUserBySessionToken(sessionToken)
        const workSpace = await getWorkSpaceByCreatedBy(String(user?._id))
        
        const note = await createNote({
            userId: user?._id,
            workSpaceId: workSpace?._id,
            title,
            content,
            settings
        })

        return res.status(200).json({
            status: 'Success',
            message: 'Note created successfully',
            note
        }).end()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const updateNoteById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const updatedNoteData = req.body;
  
        const note = await getNoteById(id);
        
        if(note){
            if (updatedNoteData.title) {
                note.title = updatedNoteData.title;
            }

            if(updatedNoteData.content){
                note.content = updatedNoteData.content
            }

            if(updatedNoteData.settings){

                if(updatedNoteData.settings.archived){
                    if(typeof updatedNoteData.settings.archived === 'boolean'){
                        note.settings.archived = updatedNoteData.settings.archived
                    }else{
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (archived)' }) 
                    }
                }

                if(updatedNoteData.settings.pinned){
                    if(typeof updatedNoteData.settings.pinned === 'boolean'){
                        note.settings.pinned = updatedNoteData.settings.pinned
                    }else{
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (pinned)' }) 
                    }
                }

                if(updatedNoteData.settings.backgroundColor){
                    if(updatedNoteData.settings.backgroundColor in enumBackgroundColor){
                        note.settings.backgroundColor = updatedNoteData.settings.backgroundColor
                    }else{
                        return res.status(400).json({ status: 'failed', message: `BackgroundColor '${updatedNoteData.settings.backgroundColor}' value is not allowed` }) 
                    }
                }

            }
      
            await note.save();

            return res.status(200).json(note).end();
        }else{
            return res.sendStatus(404)
        }
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
};

export const deleteNoteByIdFc = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
  
      const deletedNote = await deleteNoteById(id);
      if(deletedNote){
        return res.status(200).json({ status: 'success', deletedNote});
      }else{
        return res.sendStatus(404)
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}