import postModel from "../model/postModel.js"
import userModel from "../model/userModel.js"
import commentModel from "../model/commentModel.js"

export const likePost = async (req, res) =>{
    const { id } = req.params 
    try {
        if(!req.userId) return res.status(404).json({message: 'Unauthenticated'})

        const post = await postModel.findById(id) 
        
        let isAlready = 0
        post.likes.forEach(element => { 
            if (element == req.userId)
            {
                isAlready = 1
            }
        })
        
        if(isAlready == 1){
            post.likes = post.likes.filter((element) => { if(element != req.userId) return element })
        }else{
            post.likes.push(req.userId)
        }
        
        const updateData = await postModel.findByIdAndUpdate( id, post, {new: true})
        updateData.save() 
        res.status(203).json(updateData)
    } catch (err) {
        res.status(409).json({'message': err.message})
    }
}

export const postComment = async (req, res) => {
    try {
        const { postID } = req.params
        
        if (req.body['parentID']) {
            const data = {
                ...req.body,
                postID,
                message : req.body['message'].split('-')[1]
            }
            await commentModel.findByIdAndUpdate(data['parentID'], {childExist : true}) 
            const newComment = commentModel(data)
            await newComment.save()
            return res.status(202).json(newComment)
        }
        else{ 
            const data = {
                ...req.body,
                postID
            }
            const newComment = commentModel(data)
            await newComment.save()
            return res.status(202).json(newComment)
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json(err.message)
    }
}


export const updateComment = async (req, res) => {
    try {
        const { commentID } = req.params
        const { message } = req.body
        const updComment = await commentModel.findByIdAndUpdate(commentID, {message: message}, {new : true})
        return res.status(202).json(updComment)
    } catch (err) {
        console.log(err);
        return res.status(403).json(err.message)
    }
}

export const removeComment = async(req, res)=>{
    try {
        const { commentID } = req.params
        const rmComment = await commentModel.findByIdAndRemove(commentID) 
        return res.status(203).json(rmComment)
    } catch (err) {
        console.log(err);
        return res.status(403).json(err.message)
    }
}

export const getComments = async (req, res) => {
    try {
        const Limit = 10
        const { postID, page } = req.params
        const skip = (page - 1) * Limit
        const totalComment = await commentModel.find({postID : postID, parentID : null }).countDocuments()
        const totalPage = Math.ceil(totalComment/Limit)
        const comments = await commentModel.find({postID : postID, parentID : null }).sort({'_id' : -1}).skip(skip).limit(Limit)
        return res.status(200).json({currentPage: parseInt(page), totalPage: totalPage ,data : comments})
    } catch (err) {
        console.log(err);
        return res.status(403).json(err.message)
    }
}


export const getCommentChild = async (req, res) => {
    try {
        const Limit = 5
        const { postID, page, commentId } = req.params
        const skip = (page - 1) * Limit
        const totalComment = await commentModel.find({postID : postID, parentID : commentId }).countDocuments()
        const totalPage = Math.ceil(totalComment/Limit)
        const comments = await commentModel.find({postID : postID, parentID : commentId }).sort({_id : -1}).skip(skip).limit(Limit)
        return res.status(200).json({currentPage: parseInt(page), totalPage: totalPage ,data : {[commentId] : comments}, commentID: commentId})
    } catch (err) {
        console.log(err);
        return res.status(403).json(err.message)
    }
}