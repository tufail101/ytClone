import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinay.js"
import { fromateDuraction } from "../utils/formateDuration.js"
import mongoose from "mongoose"
import { User } from "../models/user.models.js"

export const getAllVideos = asyncHandler(async(req,res) => {
    const {page,limit} = req.query
    const skip = (page - 1) * limit;
    const totalNumverOfVideo = await Video.countDocuments({isPublished : true})
    const video = await Video.find({isPublished : true})
    .sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    .populate("owner"," name username avatar")

 if (!video || video.length === 0) {
    throw new ApiError(404, "No videos found");
}

    return res
    .status(200)
    .json(
        new ApiResponse(
            200
            ,{
                totalNumverOfVideo,
                currentPage : page,
                numberOfPage : Math.ceil(totalNumverOfVideo/limit),
                video
            },
            "Video fetched succesfull"
        )
    )
})

export const getVideoBySearch = asyncHandler(async(req,res) => {
    const {page,limit,query} = req.query
    const skip = (page - 1) * limit
    const totalNUmberOfVideo =  await Video.countDocuments({
        isPublished : true,
        title : {$regex : query,$options : "i"}
    })
    const video = await Video
    .find({
        isPublished : true,
        title : {$regex : query,$options : "i"}
    })
    .sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    .populate("owner","name username avatar")

    if (!video || video.length === 0) {
        throw new ApiError(404,"Video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
            totalNUmberOfVideo,
            currentPage : page,
            video
        },
        "Video featched succesfully based on your query"

        )
    )
})

export const publishVideo = asyncHandler(async (req,res) => {
    const {title,discription} = req.body
    if (!title || !discription) {
        throw new ApiError(400,"Title and Discription is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"Thumbnail is required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
      if (!videoLocalPath) {
        throw new ApiError(400,"Video is required")
    }

    const thumbnailCloudinaryResponse = await uploadOnCloudinary(thumbnailLocalPath)
     if (!thumbnailCloudinaryResponse) {
        throw new ApiError(500,"failed to upload thumbnail")
    }

    const videoCloudinaryResponse = await uploadOnCloudinary(videoLocalPath)
    if (!videoCloudinaryResponse) {
        throw new ApiError(500,"failed to upload video")
    }

    const video =await new Video({
        title,
        discription,
        thumbnail : thumbnailCloudinaryResponse.secure_url,
        videourl : videoCloudinaryResponse.secure_url,
        duration : fromateDuraction(videoCloudinaryResponse.duration),
        owner : req.user?._id
    })

    if (!video) {
        throw new ApiError(500,"Failed to upload video")
    }

    await video.save()
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push : {
                video : video._id
            }
        },
        {
            new : true
        }
    )

    
     
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video upload succesfully")
    )
    
})

export const updateVideo = asyncHandler(async (req,res) => {
    const {videoId} = req.params
    const {title,discription} = req.body
    if (!title || !discription) {
        throw new ApiError(400,"Title and Discription is required")
    }

    const thumbnailLocalPath = req.file?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"Thumbnail is required")
    }

    const thumbnailCloudinaryResponse = await uploadOnCloudinary(thumbnailLocalPath)
     if (!thumbnailCloudinaryResponse) {
        throw new ApiError(500,"failed to upload thumbnail")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                discription,
                thumbnail : thumbnailCloudinaryResponse.secure_url
            }
        },
        {
            new : true
        }
    )
     if (!updatedVideo) {
        throw new ApiError(404, {}, "Video not found.");
    }

await updatedVideo.save({validateBeforeSave : false})


return res
.status(200)
.json(
    new ApiResponse(200,updatedVideo,"Video updated succesfully")
)

})

export const deleteVideo = asyncHandler(async(req,res) => {
    const {videoId} = req.params

    await Video.findByIdAndDelete(videoId)
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $pull: {
                video:videoId
            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Video deleted succesfully")
    )
})

export const toggleVideoPublish = asyncHandler(async(req,res) => {
    const {videoId} = req.params

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404,"Video not found")
    }

    video.isPublished = !video.isPublished

    await video.save()

    const updatedVideo = await Video.findById(videoId)
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedVideo,"Video publish status is changed successfully")
    )
})

export const getVideoById = asyncHandler(async (req,res) => {
    const {videoId} = req.params
    // console.log(req.user?._id);
    const userId = req.user?._id
    
   const videoDoc = await Video.findById(videoId)

   videoDoc.views = Array.isArray(videoDoc.views)
  ? videoDoc.views
  : videoDoc.views ? [videoDoc.views] : [];
   if (!videoDoc.views?.includes(userId)) {
        
        
        videoDoc.views.push(userId)
        await videoDoc.save()
   }
    const video = await Video.aggregate([
        {
            $match : {
                _id :new  mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "OwnerDetails",
                pipeline : [
                    {
                        $lookup : {
                            from :"subscriptions",
                            localField : "_id",
                            foreignField : "channel",
                            as : "subscribers"
                        }
                    },
                    {
                        $addFields:{
                            subscriberCount : {
                                $size: "$subscribers"
                            }
                        }
                    },
                    {
                        $project: {
                            name : 1,
                            username : 1,
                            avatar : 1,
                            subscriberCount:1

                        }
                    }
                ]
            }
        },
        {
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField : "video",
                as : "like"

            },
            
        },
        {
            $project : {
                title : 1,
                discription :1,
                thumbnail : 1,
                videourl : 1,
                duration :1,
                viewsCount:{$size : "$views"},
                likes : {$size : "$like"},
                OwnerDetails : 1
                
            }
        }
    ])
    // console.log(video);
    
    if (!video || video.length <= 0) {
        throw new ApiError(404,"Video not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video[0],"Video feehced successfully")
    )
})