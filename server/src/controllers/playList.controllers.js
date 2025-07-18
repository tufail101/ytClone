import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PlayList } from "../models/playList.model.js"


export const createPlaylist = asyncHandler(async(req,res) => {
    const {name,description} = req.body
    const owner = req.user?._id

    if (!name || !description) {
        throw new ApiError(400,"Name and Description are required")
    }

    const playList = new PlayList({
        name,
        description,
        owner
    })
    if (!playList) {
        throw new ApiError(500,"Failed create playlist")
    }
    await playList.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,playList,"PlayList created succesfull")
    )
})

export const addVideoToPlayList = asyncHandler(async(req,res) => {
    const {playListId ,videoId} = req.params

    const playList = await PlayList.findById(playListId)

    if (playList.video.includes(videoId)) {
        throw new ApiError(400,"Video already exits")
    }
    
     playList.video.push(videoId)
     playList.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,playList,"Video added succesfull")
    )
})

export const removeVideoFromPlayList = asyncHandler(async(req,res) => {
    const {playListId,videoId} = req.params

    const playList = await PlayList.findById(playListId)

    if (!playList) {
        throw new ApiError(404,"PlayList not found")
    }

    playList.video.pop(videoId)
    await playList.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Video removed succesfull")
    )

})

export const getPlayListById = asyncHandler(async(req,res) => {
    const {playListId} = req.params

    const playList = await PlayList.findById(playListId).populate("video")

    if (!playList) {
        throw new ApiError(400,"playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,playList,"Playlist fetched succesfull")
    )
})

export const deletePlaylist = asyncHandler(async(req,res) => {
    const {playListId} = req.params;

        const playlist = await PlayList.findById(playListId);

    if (!playlist) {
      throw new ApiError(404,"PlayList not found");
    }
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403,"You can not delete this playlist")
    }
    await PlayList.findByIdAndDelete(playListId);

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"PlayList deleted succesfull")
    )
})

export const updatePlayList = asyncHandler(async(req,res) => {
    const {name ,description} = req.body;
    const {playListId} = req.params
    if (!name || !description) {
        throw new ApiError(300,"name and description is requred")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playListId,
        {
            name,
            description
        },
        {
            new : true
        }
    )
    if (!updatedPlaylist) {
        throw new ApiError(500,"Failed to update playList")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedPlaylist,"Update playlist succesfull")
    )
})