import express from 'express'
const router = express.Router()
import { signIn, signUp, googleLogin } from '../controller/userController.js'


router.post('/signin', signIn)
router.post('/signup', signUp)
router.post('/googlelogin', googleLogin)

export default router