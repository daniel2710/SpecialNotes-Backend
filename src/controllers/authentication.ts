import express from 'express';
import { createUser, getUserByEmail } from '../methods/user';
import { authentication, randomToken } from '../helpers/index'

export const register = async (req: express.Request, res: express.Response) =>{

    try {
        const { name, lastname, birthday, username, email, password } = req.body;

        let missingField;

        switch (true) {
            case !name:
                console.log("Please enter");
                missingField = 'Name';
                break;
            case !lastname:
                console.log("Please enter");
                missingField = 'Lastname';
                break;
            case !username:
                console.log("Please enter");
                missingField = 'Username';
                break;
            case !email:
                console.log("Please enter");
                missingField = 'Email';
                break;
            case !password:
                console.log("Please enter");
                missingField = 'Password';
                break;
            default:
                break;
        }
    
        if (missingField) {
            return res.sendStatus(400).json({ error: `${missingField} is required` });
        }

        const existingUser = await getUserByEmail(email)
        if(existingUser) {
            return res.sendStatus(400).json({ error: 'User already exists'});
        }

        const token = randomToken()
        const user = await createUser({
            name,
            lastname, 
            birthday,
            username,
            email,
            authentication: {
                token: token,
                password: authentication(token, password)

            }
        })

        return res.sendStatus(200).json({
            status: 'User created successfully',
            user
        }).end()

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }

}