import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinay.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500,"Somthing went wrong")
        
    }
}

export const register = asyncHandler(async(req,res) => {
    const {name,username,email,password} = req.body;

    if (!name || !username || !email || !password) {
        throw new ApiError(401,"All fields are required")
    }

    const exitsUser = await User.findOne({username: username})
    if (exitsUser) {
        throw new ApiError(401,"User already exist")
    }
    
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
   
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";
    
    

     if (!avatarLocalPath) {
        throw new ApiError(401,"Avatar file not uploaded")
    }

    const avatarCloudinaryResponse = await uploadOnCloudinary(avatarLocalPath)
    // console.log(avatarCloudinaryResponse);
    
    const coverImageCloudinaryResponse = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarCloudinaryResponse) {
        throw new ApiError(400,"Avatar File is required")
    }

    const user = await new User({
        name,
        username,
        email,
        password,
        avatar : avatarCloudinaryResponse.secure_url,
        coverimage : coverImageCloudinaryResponse.secure_url
    })

    await user.save();

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500,"Failed to create user")
    }
    res
    .status(200)
    .json(
        new ApiResponse(200,createdUser,"User register succesfull")
    )
})

export const login = asyncHandler(async (req,res) => {

    // console.log(req.body);
    
    const {username, password} = req.body

    if (!username || !password) {
        throw new ApiError(401,"All fields are required")
    }

    const user = await User.findOne({username : username})
    if (!user) {
        throw new ApiError(404,"User not found")
    }

    const isPasswordCorrect = user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400,"Incorrect password")
    }

    const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly : true,
        secure : true
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken)
    .json(
        new ApiResponse(200,loggedInUser,"User succesfully loged in")
    )
})

export const refreshAccessToken = asyncHandler(async (req,res) => {
   const incomingRefreshToken =  req?.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(400,"Unauthorized access")
    }

    const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET_KEY)

    const user = await User.findById(decodedToken._id)
   if (!user) {
    throw new ApiError(401,"Invalid rfreshToken")
   }

   if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(400,"RefreshToken is expired")
   }

   const {accessToken ,refreshToken} =await generateAccessTokenAndRefreshToken(user._id)
   
   
   user.refreshToken = refreshToken
   await user.save();
   const option = {
    httpOnly : true,
    secure : true
   }

   res
   .status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",refreshToken)
   .json(
    new ApiResponse(
        200,
        {
            accessToken,refreshToken : refreshToken
        },
        "Access token refreshed successfully"
    )
   )
})

export const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }

    )

    const option = {
        httpOnly : true,
        secure : true
    }
    res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(
        new ApiResponse(200,{},"User logout succesfully")
    )
})



export const changeCurrentPassword = asyncHandler(async (req,res) => {
    const {oldPassword,newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new ApiError(400,"All flied are required")
    }
    const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   if (!isPasswordCorrect) {
    throw new ApiError(400,"wrong password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave : false})

   return res
   .status(200)
   .json(
    new ApiResponse(200,{},"Password chnaged succesfull")
   )
})

export const updateAccountDetails = asyncHandler(async (req,res) => {
    const {newName,newEmail} = req.body
    if (!newName || !newEmail) {
        throw new ApiError(400,"All details are required")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                name : newName,
                email : newEmail
            }
        },
        {
            new : true
        }

    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"User name and email has been chnaged succesfully")
    )


})

export const updateUserAvatar = asyncHandler(async (req,res) => {
    const newAvatarLocalPath = req.file?.path

    if (!newAvatarLocalPath) {
        throw new ApiError(400,"Avatar is required")
    }

    const newAvatarCloudinaryResponse = await uploadOnCloudinary(newAvatarLocalPath)

    if (!newAvatarCloudinaryResponse) {
        throw new ApiError(500,"Somthing worgn when uploading avatar")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : newAvatarCloudinaryResponse.secure_url
            }
        },
        {
            new : true
        }
    )

    if (!updatedUser) {
        throw new ApiError(500,"Failed to update avatar")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"User avatar updated")
    )
})

export const updateUserCoverImg = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400,"Cover image is required")
    }

    const coverImageCloudinaryResponse = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImageCloudinaryResponse) {
        throw new ApiError(500,"Somthing wrong when upload coverimage on cloudinary")       
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage : coverImageCloudinaryResponse.secure_url
            }
        },
        {
            new :true
        }
    )

    if (!updatedUser) {
        throw new ApiError(400,"Failed to upload cover image")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"Cover image updated succesfully")
    )
})


export const getCurrentUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400,"Login is required")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"User fetched succesfully")
    )
})

export const getUserProfile = asyncHandler( async (req,res) => {
    const {userId} = req.params

    const user = await User.aggregate([
        {
            $match :{
                _id : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscriber"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribed"
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video",
                pipeline : [
                    {
                        $project : {
                            title : 1,
                            discription : 1,
                            thumbnail : 1,
                            videourl : 1,
                            duration : 1,
                            views : 1,
                            isPublished : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields :{
                subscriberCount : {
                    $size : "$subscriber"
                },
                subscribedCount : {
                    $size : "$subscribed"
                }
            }
        },
        {
            $project : {
                name : 1,
                username : 1,
                avatar : 1,
                coverimage : 1,
                video : 1,
                subscriberCount : 1,
                subscribedCount : 1
            }
        }
    ])

    if (!user) {
        throw new ApiError(500,"Failed to fetch user profile")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user[0],"User profile fetched succesful")
    )
})