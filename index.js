import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import postRouter from './Routes/postRoutes.js'
import userRouter from './Routes/userRoutes.js' 
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'

dotenv.config()

const app = express()

app.use(fileUpload())
app.use(bodyParser.json({limit: "300mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "300mb", extended: true}))
app.use(cors())
app.use(express.static('public'))

app.use('/posts', postRouter)
app.use('/users', userRouter)

app.all('*', (req,res) => {
    res.json({"every thing":"is awesome"})
})


const CONNECTION_URL = "mongodb+srv://weaponlion:mernStack@cluster0.jzmj4r9.mongodb.net/?retryWrites=true&w=majority"

 
const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', true);

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("listening for requests");
    })
})
.catch((err)=>{
    console.log(err.message);
})


