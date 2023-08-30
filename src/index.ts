import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';  
import connectToDatabase from './db/connection';
import routes from './routes';
import requestLogger from './middlewares/logger';

dotenv.config();    
const PORT = process.env.PORT ?? 8080
export const URL = 'https://specialnotesback.onrender.com'
const app = express()
  
app.use(cors({
    credentials: true,
    origin: ['https://special-notes-frontend.vercel.app', 'https://specialnotesback.onrender.com']
}))
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(requestLogger)

connectToDatabase()

const server = http.createServer(app);

server.listen(PORT, ()=>{
    console.log("server listening on https://specialnotesback.onrender.com");
});

app.use('/', routes())


