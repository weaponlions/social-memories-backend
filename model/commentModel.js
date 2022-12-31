import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    postID : String, 
    message : String,
    userID : String,
    userName : String,
    userLogo : {
        type: String,
        default : null
    },
    parentID : {
        type: String,
        default : null
    },
    targetedUser : {
        type : String,
        default : null
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },
    childExist : {
        type : Boolean,
        default : false
    }
})

const commentModel = mongoose.model('PostComments', commentSchema)

export default commentModel