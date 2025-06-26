import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"

export const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    const userId = req.user?._id
    
    if (String(channelId) === String(userId)) {
        throw new ApiError(400,"You can not subscribe your self")
    }

    const isSubscribe = await Subscription.findOne({
        subscriber : userId,
        channel : channelId
    })

    if (isSubscribe) {
        await Subscription.findByIdAndDelete(isSubscribe._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Unsubscribed succesfull")
        )
    } else {
        await Subscription.create({
            subscriber : userId,
            channel : channelId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Subscribed Successfull")
        )
    }
})

export const getUserChannelSubscribers = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    const listOfSubscribers =await Subscription.aggregate([
        {
            $match :{
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "subscriber",
                foreignField : "_id",
                as : "subscribers",
                pipeline : [
                    {
                        $project: {
                            _id : 1,
                            name : 1,
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "subsciber",
                foreignField : "channel",
                as : "subscriberOfSubsciber"
            }
        },
        {
            $addFields : {
                "subscribers.countOfSubscribers" : {
                    $size : "$subscriberOfSubsciber"
                }
            }
        },
        {
            $unwind : "$subscribers"
        },
        {
            $replaceRoot : {
                newRoot : "$subscribers"
            }
        }
    ])

    if (!listOfSubscribers || listOfSubscribers.length <= 0) {
        throw new ApiError(404,"Subscribers not found or 0 subscribers")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,listOfSubscribers[0],"list of subscribers are fetched succesfully")
    )
})

export const getSubscribedChannel = asyncHandler(async(req,res) => {
    const subscriberId = req.user?._id
    
    const allSubscribedChannel = await Subscription.aggregate([
        {
            $match : {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "subscribedChannel",
                pipeline: [
                    {
                        $project : {
                            _id : 1,
                            name : 1,
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "channel",
                foreignField : "channel",
                as : "channelSubscribers"
            }
        },
        {
            $addFields :{
                "subscribedChannel.subscriberCount" : {
                    $size : "$channelSubscribers"
                }
            }
        },
        {
            $unwind : "$subscribedChannel"
        },
        {
            $replaceRoot : {
                newRoot : "$subscribedChannel"
            }
        }
    ])

    if(!allSubscribedChannel || allSubscribedChannel.length <= 0){
        throw new ApiError(404,"User have not subscribe any channel")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,allSubscribedChannel[0],"Subscribed channel fetched succesfully")
    )
})