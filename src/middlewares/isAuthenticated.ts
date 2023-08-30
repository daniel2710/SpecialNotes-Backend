import express from 'express'
import { merge } from 'lodash'
import { getUserBySessionToken } from '../methods/user' 

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) =>{
    try {
        const sessionToken = req.cookies['SPECIALNOTES-AUTH']
        if(!sessionToken){
            console.log("No session token")
            return res.sendStatus(403)
        }

        const existingUser = await getUserBySessionToken(sessionToken)
        if(!existingUser){
            console.log("No user exists")
            return res.sendStatus(403)
        }

        merge(req, { identity: existingUser })

        return next()
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}