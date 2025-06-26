import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    username :{
        type : String,
        require : true,
        unique : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true,
    },
     avatar : {
        type : String,
        require : true,
    },
     coverimage : {
        type : String,
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    video : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    refreshToken :{
        type : String
    }
    
},{timestamps : true})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({_id : this._id},process.env.REFRESH_TOKEN_SECRET_KEY,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIREIN
    })
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            name : this.name,
            username : this.username,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn : process.env.access_TOKEN_EXPIREIN
        }
    )
}
export const User = mongoose.model("User",userSchema)