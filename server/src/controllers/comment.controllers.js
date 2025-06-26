import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.models.js"
import mongoose from "mongoose"


export const publishCommentOnVideo = asyncHandler(async(req,res) => {
    const {content} = req.body
    const {videoId} = req.params
    const commentBy = req.user?._id
    if (!content) {
        throw new ApiError(400,"Content of comment is requored")
    }

    const comment = new Comment({
        content : content,
        commentBy : commentBy,
        video : videoId
    })

    if (!comment) {
        throw new ApiError(500,"Failed to comment")
    }
    await comment.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"Comment post Succesfull")
    )

})

export const getVideoComment = asyncHandler(async(req,res) => {
    const {videoId} = req.params

    const comments =await Comment.aggregate([
        {
            $match : {
                video : new mongoose.Types.ObjectId(videoId),
                // comment: null,
                
            }
        },
        {
            $lookup : {
                from : "comments",
                localField : "_id",
                foreignField : "replyTo",
                as : "replies"
            }
        },
        {
            $lookup: {
                from : "users",
                localField : "commentBy",
                foreignField : "_id",
                as : "commentBy",
                pipeline : [
                    {
                        $project : {
                            name : 1,
                            username : 1,
                            avatar : 1

                        }
                    }
                ]
            }
        },
         {
            $unwind: "$commentBy"
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "comment",
                as : "likes"
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likes" }
            }
        },
        {
          $project : {
            content : 1,
            createdAt: 1,
            commentBy: 1,
            likeCount: 1,
            replies : 1
          }
        }
    ])

    if (!comments || comments.length <= 0) {
        throw new ApiError(404,"Not comment found on this video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,comments,"comment fetched succesfull")
    )
})

export const publishCommentOnComment = asyncHandler(async(req,res) => {
    const {content} = req.body
    const {commentId} = req.params
    const commentBy = req.user?._id
    // console.log(commentId);
    

    if (!content) {
        throw new ApiError(400,"Content is neede for comment")
    }
    const parentComment = await Comment.findById(commentId)
     if (!parentComment) {
        throw new ApiError(404, "Parent comment not found");
    }

    const newComment = new Comment({
        content,
        commentBy ,
        replyTo : commentId
        
    })
    await newComment.save()

    if (!newComment) {
        throw new ApiError(500,"Failed to comment")
    }


    // parentComment.comment.push(newComment._id)
    // await parentComment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,{parentComment,newComment},"Commnet post seuccesfull")
    )

})

