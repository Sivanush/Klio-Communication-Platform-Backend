import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { userRouter } from './routes/userRoute'
import { createServer } from 'http';
import connectToDb from '../database/mongoose'
import cors from "cors";
import { adminRoute } from './routes/adminRoute';
import { friendsRoute } from './routes/friendsRoute';
import { serverRouter } from './routes/serverRoute';
import { removeOldInvites } from '../../adapters/repository/schema/inviteCodeScema';
import { setupSocket } from '../socket/setupSocket';
import { errorHandler } from './middleware/errorHandler';
import { postRouter } from './routes/postRoute';

const app = express()
const server = createServer(app);
const port = process.env.PORT || 3000



const corsOptions = {
   origin: [process.env.CLIENT_URL as string, 'http://localhost:4200'],
   methods: 'GET,PUT,POST,PATCH,OPTIONS',
   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
   credentials: true,
};
app.use(cors(corsOptions));





connectToDb()

app.use(express.json())
app.use('/api/',userRouter)
app.use('/api/',friendsRoute)
app.use('/api/',serverRouter)
app.use('/api/',postRouter)
app.use('/api/admin/',adminRoute)

app.use(errorHandler)

setupSocket(server)



setInterval(removeOldInvites, 24 * 60 * 60 * 1000);

server.listen(port, () => {
   console.log(`Example app listening on port ${port}!`),
   console.log('Client URL:', process.env.CLIENT_URL);
})