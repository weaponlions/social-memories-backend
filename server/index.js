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
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use(express.static('public'))

app.use('/posts', postRouter)
app.use('/users', userRouter)



const CONNECTION_URL = process.env.URL
// this for local system
// const CONNECTION_URL2 = process.env.SYS_MONGO
const options = {
    dbname : process.env.dbname
}
// end sys

const PORT = process.env.PORT

// mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(CONNECTION_URL, options, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server Running on port http://localhost:${PORT}`);
    })
})
.catch((err)=>{
    console.log(err.message);
})
  
