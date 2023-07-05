import express from 'express'
import { deleteUserById, getUserByEmail, getUserById, getUserByUsername, getUsers } from "../methods/user";
import { deleteWorkSpaceByCreatedBy } from '../methods/workspaces';

export const getAllUsers = async (_req: express.Request, res: express.Response) =>{
    try {
        const users = await getUsers()
        return res.status(200).json({ status: 'success', users })
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

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

export const deleteUserByIdFc = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
  
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