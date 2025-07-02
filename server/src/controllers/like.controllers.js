import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Like} from "../models/like.models.js"
import mongoose from "mongoose"

export const toggleVideoLike = asyncHandler(async(req,res) => {
    const {videoId} = req.params;
    const likedBy = req.user?._id;

    const isLiked = await Like.findOne({
        likedBy : likedBy,
        video : videoId
    })
    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,{isLiked : false},"Remove like Succesfully")
        )
    } else {
        await Like.create({
            likedBy : likedBy,
            video : videoId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200,{isLiked : true},"Liked successfull")
        )
    }
})

export const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    const likedBy = req.user?._id;

    const isLiked = await Like.findOne({
        likedBy : likedBy,
        comment : commentId
    })
    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Remove like succesfull")
        )
    } else {
        await Like.create({
            likedBy : likedBy,
            comment : commentId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Liked succesfull")
        )
    }
})

export const getAllLIkedVideo = asyncHandler(async(req,res) => {
    const userId = req.user?._id
    
    const likedVideo =await Like.aggregate([
        {
            $match : {
                likedBy : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "likedVideo",
                pipeline : [
                    {
                        $project : {
                            title : 1,
                            discription: 1,
                            thumbnail : 1,
                            videourl : 1,
                            duration : 1,
                            views : 1
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from : "likes",
                localField : "video",
                foreignField: "video",
                as : "likeVideo"
            }
        },
        {
            $addFields: {
                "likedVideo.likeCount":{
                    $size : "$likeVideo"
                }
            }
        },
        {
            $unwind :"$likedVideo"
        },
        {
            $replaceRoot : {
                newRoot : "$likedVideo"
            }
        }
    ])

    if (!likedVideo ||  likedVideo.length <=0) {
        throw new ApiError(404,"User not liked any video")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,likedVideo[0],"Liked video fetched succesfull")
    )
})

