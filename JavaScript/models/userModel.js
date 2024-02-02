import mongoose from "mongoose";

const userSchema = new mongoose.Schema = ({
    firstName : {
        type : String, 
        required : [true,'Enter Your FirstName'], 
        trim : true
    },
    lastName : {
        type : String, 
        required : [true,'Enter Your LastName'], 
        trim : true
    },
    userName : {
        type : String, 
        required : [true,'Enter Your userName'], 
        trim : true, 
        minLength : 4
    },
    passWord : {
        type : String,
        required : [true,'Enter Your passWord'],
        trim : true, 
        minLength  : 6
    },
    email : {
        type : String, 
        required : [true,'Enter Your email'], 
        trim : true
    },
    avatar : {
        public_id : {
            type : String
        },
        url : {
            type : String
        }
    },
    role : {
        type : String,
        default : "user"
    },
    createdAt : {
        type : Date,
        default: Date.now
    },
resetPasswordToken: String,
resetPasswordExpire: Date,
})

const userModel = mongoose.model('Users',userSchema);
export {userModel}