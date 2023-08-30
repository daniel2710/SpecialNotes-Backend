import express from 'express'
import { createNote, deleteNoteById, getNoteById, getNotes, getNotesByIdUser } from '../methods/notes';
import { paginate } from '../helpers/pagination';
import { getUserBySessionToken } from '../methods/user';
import { getWorkSpaceByCreatedBy } from '../methods/workspaces';
import { enumBackgroundColor } from '../enums/notes';
import { settingsNotesModel } from '../schemas/settingsNotes';

export const getAllNotes = async (req: express.Request, res: express.Response) => {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const search = req.query.search as string || '';
    const activeOnly = req.query['active'] === 'true';
    const archivedOnly = req.query['archived'] === 'true';

    try {
        const notes = await getNotes();
        let filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
        );

        if (activeOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.active);
        }else if(!activeOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.active);
        }

        if (!archivedOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.archived);
        }else if(archivedOnly){
            filteredNotes = filteredNotes.filter(note => note.settings.archived);
        }
        
        const sortedNotes = filteredNotes.sort((a, b) => {
            if (a.settings.pinned && !b.settings.pinned) {
                return -1; // a comes before b
            } else if (!a.settings.pinned && b.settings.pinned) {
                return 1; // b comes before a
            } else {
                return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by date
            }
        });
        
        const paginatedResult = paginate(sortedNotes, currentPage, limit, 'notes');
    
        const response = {
          status: 'success',
          notes: paginatedResult.results,
          current_page: currentPage,
          total_pages: paginatedResult.totalPages,
          next: paginatedResult.hasNextPage,
          previous: paginatedResult.hasPreviousPage,
          total_items: paginatedResult.totalItems,
          items_on_page: paginatedResult.results.length,
          active_only: activeOnly,
          archived_only: archivedOnly,
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

export const getNotesByUserToken = async (req: express.Request, res: express.Response) => {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const search = req.query.search as string || '';
    const activeOnly = req.query['active'] === 'true';
    const archivedOnly = req.query['archived'] === 'true';

    try {
        const userId = req.params.id; 
        const notes = await getNotesByIdUser(userId); 

        let filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
        );

        if (activeOnly) {
            filteredNotes = filteredNotes.filter(note => note.settings.active);
        }else if(!activeOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.active);
        }

        if (!archivedOnly) {
            filteredNotes = filteredNotes.filter(note => !note.settings.archived);
        }else if(archivedOnly){
            filteredNotes = filteredNotes.filter(note => note.settings.archived);
        }
        
        const sortedNotes = filteredNotes.sort((a, b) => {
            if (a.settings.pinned && !b.settings.pinned) {
                return -1; // a comes before b
            } else if (!a.settings.pinned && b.settings.pinned) {
                return 1; // b comes before a
            } else {
                return b.createdAt.getTime() - a.createdAt.getTime(); // Sort by date
            }
        });
        
        const paginatedResult = paginate(sortedNotes, currentPage, limit, 'notes');
    
        const response = {
          status: 'success',
          notes: paginatedResult.results,
          current_page: currentPage,
          total_pages: paginatedResult.totalPages,
          next: paginatedResult.hasNextPage,
          previous: paginatedResult.hasPreviousPage,
          total_items: paginatedResult.totalItems,
          items_on_page: paginatedResult.results.length,
          active_only: activeOnly,
          archived_only: archivedOnly,
        };

        if (paginatedResult.results.length === 0 && currentPage != 1) {
            return res.status(400).json({ status: "failed", message: "There are no results on the current page." });
        }
    
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

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
        const { title, content, settings } = req.body;
        const settingsDefault = new settingsNotesModel();
        const sessionToken = req.cookies['SPECIALNOTES-AUTH']

        if(!title){
            return res.status(400).json({ status: 'failed', message: `title is required` });
        }else if(!content){
            return res.status(400).json({ status: 'failed', message: `content is required` });
        }

        if(settings){
            if(settings.archived){
                if(typeof settings.archived !== 'boolean'){
                    return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (archived)' }) 
                }
            }

            if(settings.pinned){
                if(typeof settings.pinned !== 'boolean'){
                    return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (pinned)' }) 
                }
            }

            if(settings.backgroundColor){
                if(!(settings.backgroundColor in enumBackgroundColor)){
                    return res.status(400).json({ status: 'failed', message: `BackgroundColor '${settings.backgroundColor}' value is not allowed` }) 
                }
            }

        }

        const user = await getUserBySessionToken(sessionToken)
        const workSpace = await getWorkSpaceByCreatedBy(String(user?._id))
        
        if(settings){
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
        }else{
            const note = await createNote({
                userId: user?._id,
                workSpaceId: workSpace?._id,
                title,
                content,
                settings:settingsDefault
            })
            return res.status(200).json({
                status: 'Success',
                message: 'Note created successfully',
                note
            }).end()
        }


    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const updateNoteById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { title, content, settings } = req.body;
  
        const note = await getNoteById(id);
        
        if(note){
            if (title) {
                note.title = title;
            }

            if(content){
                note.content = content
            }

            if(settings){
                if(settings.hasOwnProperty('archived')){
                    if(typeof settings.archived === 'boolean'){
                        note.settings.archived = settings.archived
                    }else{
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (archived)' }) 
                    }
                }

                if(settings.hasOwnProperty('pinned')){
                    if(typeof settings.pinned === 'boolean'){
                        note.settings.pinned = settings.pinned
                    }else{
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (pinned)' }) 
                    }
                }

                if(settings.hasOwnProperty('active')){
                    if(typeof settings.active === 'boolean'){
                        note.settings.active = settings.active
                    }else{
                        return res.status(400).json({ status: 'failed', message: 'Data type is not allowed (active)' }) 
                    }
                }

                if(settings.backgroundColor){
                    if(settings.backgroundColor in enumBackgroundColor){
                        note.settings.backgroundColor = settings.backgroundColor
                    }else{
                        return res.status(400).json({ status: 'failed', message: `BackgroundColor '${settings.backgroundColor}' value is not allowed` }) 
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