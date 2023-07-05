import express from 'express'
import authentication from './authentication';
import users from './users'
import workspaces from './workspaces';

const routes = express.Router();

export default (): express.Router =>{
    authentication(routes)
    users(routes)
    workspaces(routes)
    return routes
}