import express from 'express';
import { createUser, deleteUserById, getUserByEmail, getUserByUsername } from '../methods/user';
import { authentication, randomToken } from '../helpers'
import { deleteNotesByUserId } from '../methods/notes';
import { deleteWorkSpaceByCreatedBy } from '../methods/workspaces';

export const login = async (req: express.Request, res: express.Response) =>{
    try {
        const { email, password } = req.body
        
        if(!email){
            return res.status(400).json({ status: 'failed', message: `email is required` });
        }else if(!password){
            return res.status(400).json({ status: 'failed', message: `password is required` });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
        if(!user){
            return res.status(400).json({ status: 'failed', message: `user does not exist` });
        }
        
        const expectedHash = authentication(user.authentication?.salt, password)
        
        if(user.authentication?.password !== expectedHash){
            return res.status(400).json({ status: 'Incorrect password' });
        }

        const salt = randomToken()
        
        user.authentication!.sessionToken! = authentication(salt, user._id.toString())
        await user.save();

        res.cookie('SPECIALNOTES-AUTH', user.authentication!.sessionToken, {
            domain: 'localhost',
            path: '/'
        })
        return res.status(200).json(user).end()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) =>{
    
    try {
        const { name, lastname, birthday, username, email, password } = req.body;
        if(!name){
            return res.status(400).json({ status: 'failed', message: `name is required` });
        }else if(!lastname){
            return res.status(400).json({ status: 'failed', message: `lastname is required` });
        }else if(!username){
            return res.status(400).json({ status: 'failed', message: `username is required` });
        }else if(!email){
            return res.status(400).json({ status: 'failed', message: `email is required` });
        }else if(!password){
            return res.status(400).json({ status: 'failed', message: `password is required` });
        }

        const existingUserByEmail = await getUserByEmail(email)
        const existingUserByUsername = await getUserByUsername(username)
        if(existingUserByEmail) {
            return res.status(400).json({ status: 'failed', message: 'User already exists'});
        }

        if(existingUserByUsername){
            return res.status(400).json({ status: 'failed', message: 'Username in use'});
        }

        const salt = randomToken()
        await createUser({
            name,
            lastname, 
            birthday,
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)

            }
        })

        return res.status(200).json({
            status: 'Success',
            message: 'User created successfully',
            user: {
                name, lastname, birthday, username, email,
                authentication: {
                    salt
                }
            }
        }).end()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }

}

export const deleteAccountByIdFc = async (req: express.Request, res: express.Response) => {
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