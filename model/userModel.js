import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String},
    picture : {type: String},
    id : {type: String}
})

const userModel = mongoose.model('user', userSchema)

export default userModel;