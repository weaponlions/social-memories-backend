import express from "express";
import { createPost, updatePost, deletePost, getPageWithSearch, getSinglePost } from "../controller/postController.js";
import { likePost, getComments, postComment, removeComment, updateComment, getCommentChild } from "../controller/commentController.js";
import auth from "../middleware/auth.js"; 

const router = express.Router()

// post routes
 

router.get('/?search=:title/:tags/:creator/:page', getPageWithSearch)
router.get('/:id', getSinglePost)
router.post('/new', auth, createPost)
router.patch('/:postId', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)

// comment routes
router.get('/comment/:postID/:page', getComments)
router.get('/comment/child/:postID/:commentId/:page', getCommentChild)
router.post('/comment/:postID', postComment)
router.patch('/comment/:commentID', updateComment)
router.delete('/comment/:commentID', removeComment)


export default router
