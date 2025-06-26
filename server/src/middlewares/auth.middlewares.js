import jwt from "jsonwebtoken"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"


const varifyjwt = asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];;
    // console.log(token);
    
     if (!token) {
         throw new ApiError(401,"Unathorized access")
     }
    //  console.log(process.env.ACCESS_TOKEN_SECRET_KEY);
     
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
     const user = await User.findById(decodedToken._id)
     if (!user) {
         throw new ApiError(401,"Invalid access token")
     }
 
     req.user = user
     next()
   } catch (error) {
    console.log(error);
    
    throw new ApiError(401,error?.message||"invalid access token")
    
   }
})

export {varifyjwt}