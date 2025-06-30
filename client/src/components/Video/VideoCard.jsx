import React from "react";
import { Link } from "react-router";

export default function VideoCard({ video }) {
  // console.log(video);
  
  return (
    <Link to={`/watch/${video._id}`} className="block">
      <div className="w-full">

        
        <img
          src={video.thumbnail}
          alt={video.title}
          className="rounded-lg w-full h-44 object-cover"
        />

        
        <div className="flex gap-3 mt-3">
         
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-10 h-10 rounded-full"
          />

         
          <div className="text-white">
            <h3 className="font-medium text-base line-clamp-2">{video.title}</h3>
            <p className="text-sm text-gray-400">{video.owner.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
