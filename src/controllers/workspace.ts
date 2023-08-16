import express from 'express'
import { deleteWorkSpaceByCreatedBy, getWorkSpaceByCreatedBy, getWorkSpaceById, getWorkSpaces } from '../methods/workspaces';
import { paginate } from '../helpers/pagination';
import { enumTheme } from '../enums/workspace';

export const getAllWorkSpaces = async (req: express.Request, res: express.Response) =>{
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    
    try {
        const workspaces = await getWorkSpaces()
        const paginatedResult = paginate(workspaces, currentPage, limit, 'workspaces');

        const response = {
            status: 'success',
            workspaces: paginatedResult.results,
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
            if (updatedWorkSpaceData.name) {
                workspace.name = updatedWorkSpaceData.name;
            }

            if(updatedWorkSpaceData.description){
                workspace.description = updatedWorkSpaceData.description
            }

            if(updatedWorkSpaceData.theme){
                if(updatedWorkSpaceData.theme in enumTheme){
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
   