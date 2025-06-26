import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title : {
        type : String,
        require:true
    },
    discription : {
        type : String,
        require:true
    },
    thumbnail : {
        type : String,
        require:true
    },
    videourl : {
        type : String,
        require:true
    },
    duration : {
        type : String,
        require:true
    },
    views :
        {
            type :[ mongoose.Schema.Types.ObjectId],
            ref : "User",
            default : []
        }

    ,
    isPublished :{
        type : Boolean,
        default : true
    },
    qualities : [
        {
            label : String,
            url : String
        }
    ],
    processing : {
        type : Boolean,
        default : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

export const Video = mongoose.model("Video",videoSchema)