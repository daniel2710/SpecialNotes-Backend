import express from 'express'
import authentication from './authentication';

const routes = express.Router();

export default (): express.Router =>{
    authentication(routes)
    return routes
}