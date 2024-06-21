import express from 'express'
import { userRouter } from './routes/userRoute'
import connectToDb from '../database/mongoose'
import cors from "cors";
import { adminRoute } from './routes/adminRoute';

const app = express()
const port = 3000

app.use(cors());
connectToDb()

app.use(express.json())
app.use('/api/',userRouter)
app.use('/api/admin/',adminRoute)



app.listen(port, () => {
   console.log(`Example app listening on port ${port}!`)
})