import express from 'express'
import { userRouter } from './routes/userRoute'
import { createServer } from 'http';
import connectToDb from '../database/mongoose'
import cors from "cors";
import { adminRoute } from './routes/adminRoute';
import { friendsRoute } from './routes/friendsRoute';
import { setupSocket } from '../../socket/directChatSocketService';

const app = express()
const server = createServer(app);
const port = 3000

app.use(cors());
connectToDb()

app.use(express.json())
app.use('/api/',userRouter)
app.use('/api/',friendsRoute)
app.use('/api/admin/',adminRoute)

setupSocket(server)

app.listen(port, () => {
   console.log(`Example app listening on port ${port}!`)
})