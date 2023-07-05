import express from 'express'
import { deleteWorkSpaceByCreatedBy, getWorkSpaceByCreatedBy, getWorkSpaceById, getWorkSpaces } from '../methods/workspaces';

export const getAllWorkSpaces = async (_req: express.Request, res: express.Response) =>{
    try {
        const workspaces = await getWorkSpaces()
        return res.status(200).json(workspaces)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getWorkSpaceByIdFc = async (req: express.Request, res: express.Response) =>{
    try {
        const workSpaceId = req.params.id; 
        const workSpace = await getWorkSpaceById(workSpaceId); 
        if(workSpace){
            return res.status(200).json({ status: 'success', workSpace });
        }else{
            return res.sendStatus(404)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}  

export const getWorkSpaceByCreatedByFc = async (req: express.Request, res: express.Response) =>{
    try {
        const userId = req.params.createdBy; 
        const workSpace = await getWorkSpaceByCreatedBy(userId); 
        if(workSpace){
            return res.status(200).json({ status: 'success', workSpace });
        }else{
            return res.sendStatus(404)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteWorkSpaceByCreatedByFc = async (req: express.Request, res: express.Response) => {
    try {
        const { createdBy } = req.params;
    
        const deletedWorkSpace = await deleteWorkSpaceByCreatedBy(createdBy);
        if(deletedWorkSpace){
            return res.status(200).json({ status: 'success', deletedWorkSpace});
        }else{
            return res.sendStatus(404)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateWorkSpaceById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const updatedWorkSpaceData = req.body;
  
        const workspace = await getWorkSpaceById(id);
        
        if(workspace){
            // Verificar si se proporcionaron datos actualizados específicos
            if (updatedWorkSpaceData.name) {
                workspace.name = updatedWorkSpaceData.name;
            }

            if(updatedWorkSpaceData.description){
                workspace.description = updatedWorkSpaceData.description
            }

            if(updatedWorkSpaceData.theme){
                if(updatedWorkSpaceData.theme === 'light' || updatedWorkSpaceData.theme === 'dark'){
                    workspace.theme = updatedWorkSpaceData.theme
                }else{
                    return res.status(400).json({ status: 'failed', message: 'theme not found' }) 
                }
            }
      
            await workspace.save();

            return res.status(200).json(workspace).end();
        }else{
            return res.sendStatus(404)
        }
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
  