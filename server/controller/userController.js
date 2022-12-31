import userModel from "../model/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
 

export const signIn = async (req, res) => {
    const {email , password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(user == null)
            return res.status(202).json({message: 'User not Found'}) 

        const passwordCorrect = await bcrypt.compare(password, user.password)

        if(!passwordCorrect)
            return res.status(202).json({message: 'Invalid Password'})

        const token = jwt.sign({email: user.email, id: user._id}, process.env.SECRET, {expiresIn: process.env.EXPIRY})

        res.status(200).json({user, token})

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong'})
    }
}
 
export const signUp = async (req, res) => {
    const {firstname, lastname, email, password} = req.body
    try {
        const userExist = await userModel.findOne({email})
        if(userExist)
            return res.status(202).json({message: "User already Exist."})

        const hashPassword = await bcrypt.hash(password, 12)

        const user = await userModel.create({ email, password: hashPassword, name: `${firstname} ${lastname}` })

        user.save()

        const token = jwt.sign({email: user.email, id: user._id}, process.env.SECRET, {expiresIn: process.env.EXPIRY})

        res.status(200).json({user, token})
         
    } catch (err) { 
        console.log(err);
        res.status(500).json({message: 'Something went wrong'})
    }
} 
 
export const googleLogin = async (req, res) => {
    const {firstname, lastname, email, picture} = req.body
    try { 
        let user = await userModel.findOne({email})

        if(user){
            const token = jwt.sign({email: user.email, id: user._id}, process.env.SECRET, {expiresIn: process.env.EXPIRY})
            return res.status(200).json({user, token})
        }
        else{
            user = await userModel.create({ email, picture, name: `${firstname} ${lastname}` })
            user.save()

            const token = jwt.sign({email: user.email, id: user._id}, process.env.SECRET, {expiresIn: process.env.EXPIRY})
            res.status(200).json({user, token}) 
        }
    } catch (err) { 
        console.log(err);
        res.status(500).json({message: 'Something went wrong'})
    }
} 
 

 
