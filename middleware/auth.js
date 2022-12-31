import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const SECRET = 'test'

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decodeData;
        if (token) {
            decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id
        } 

        next()
    } catch (err) {
        console.log(err);
    }
}


export default auth