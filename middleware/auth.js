import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decodeData;
        if (token) {
            decodeData = jwt.verify(token, process.env.SECRET)
            req.userId = decodeData?.id
        } 

        next()
    } catch (err) {
        console.log(err);
    }
}


export default auth