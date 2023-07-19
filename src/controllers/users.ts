import express from 'express'
import { deleteUserById, getUserByEmail, getUserById, getUserBySessionToken, getUserByUsername, getUsers } from "../methods/user";
import { deleteWorkSpaceByCreatedBy } from '../methods/workspaces';
import { paginate } from '../helpers/pagination';
import { deleteNotesByUserId } from '../methods/notes';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;

    try {
        const users = await getUsers();
        const paginatedResult = paginate(users, currentPage, limit, 'users');
    
        const response = {
          status: 'success',
          users: paginatedResult.results,
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

export const getUserByIdFc = async (req: express.Request, res: express.Response) =>{
    try {
        const userId = req.params.id; 
        const user = await getUserById(userId); 
        if(user){
            return res.status(200).json({ status: 'success', user }); 
        }else{
            return res.sendStatus(404);   
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getUserByUsernameFc = async (req: express.Request, res: express.Response) =>{
    try {
        const username = req.params.username; 
        const user = await getUserByUsername(username); 
        if(user){
            return res.status(200).json({ status: 'success', user });
        }  else{
            return res.sendStatus(404)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getUserByEmailFc = async (req: express.Request, res: express.Response) =>{
    try {
        const email = req.params.email; 
        const user = await getUserByEmail(email); 
        if(user){
            return res.status(200).json({ status: 'success', user });
        }  else{
            return res.sendStatus(404)
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUserByIdFc = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { name, lastname, username,  } = req.body;
    
        if (!username) {
          return res.status(400).json({ status: 'failed', message: 'Username is required' });
        }else if(!name){
            return res.status(400).json({ status: 'failed', message: 'Name is required' });
        }else if(!lastname){
            return res.status(400).json({ status: 'failed', message: 'Lastname is required' });
        }
    
        const user = await getUserById(id);
        
        if(user){
            user.name = name;
            user.lastname = lastname;
            user.username = username;
            await user.save();
        }
    
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUserBySessionTokenFc = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.params.sessionToken; 
        const user = await getUserBySessionToken(sessionToken); 
        if(user){
            return res.status(200).json({ status: 'success', user }); 
        }else{
            return res.sendStatus(400);   
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUserByIdFc = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
  
      await deleteNotesByUserId(id);
      const deletedUser = await deleteUserById(id);
      const deletedWorkspace = await deleteWorkSpaceByCreatedBy(id)

      if(deletedUser && deletedWorkspace){
        return res.status(200).json({ status: 'success', deletedUser, deletedWorkspace});
      }else{
        return res.sendStatus(404)
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}