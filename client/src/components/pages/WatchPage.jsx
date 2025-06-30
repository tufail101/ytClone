import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { videoById } from "../../api/videoApi";

export default function WatchPage() {
  const { id } = useParams();
  const apiUrl = import.meta.env.REACT_APP_API_URL;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [currentQuelity ,setCurrentQuelity] = useState("360p")

  const handleLike = async () => {
    try {
      await axios.post(`${apiUrl}/like/likeVideo/${video._id}`);
      setLiked(true);
      setDisliked(false);
    } catch (error) {
      console.error("Toggle like failed:", error);
    }
  };
  const handleSubscribe = async () => {
    try {
      await axios.post(
        `${apiUrl}/subscription/toggleSubscription/${video.owner._id}`
      );
      setSubscribed(false);
    } catch (error) {
      console.error("Toggle subscribe failed:", error);
    }
  };

  const handleDislike = () => {
    
  }

  useEffect(() => {
    setLoading(true);
    videoById(id)
      .then((res) => {
        setVideo(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  
const handleQualityChange = () => {

}
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-4 text-white bg-[#0f0f0f]">
        Video not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#0f0f0f] min-h-screen text-white">
      
      <video
        src={video.videourl}
        controls
        className="w-full max-h-[500px] rounded-lg mb-4"
      />
          {/* <select
      value={currentQuelity}
      onChange={handleQualityChange}
      className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 text-sm rounded"
    >
      {Object.keys(video?.sources).map((q) => (
        <option key={q} value={q}>
          {q}
        </option>
      ))}
    </select> */}

      <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={video.OwnerDetails[0].avatar}
            alt={video.OwnerDetails[0].username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{video.OwnerDetails[0].name}</p>
            <p className="text-gray-400 text-sm">@{video.OwnerDetails[0].username}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleLike}
            className={`px-4 py-1 rounded-full ${
              liked ? "bg-red-600 text-white" : "bg-[#1f1f1f] text-gray-300"
            } hover:bg-red-500 transition`}
          >
            👍 Like {video.likes}
          </button>

          <button
            onClick={handleDislike}
            className={`px-4 py-1 rounded-full ${
              disliked ? "bg-blue-600 text-white" : "bg-[#1f1f1f] text-gray-300"
            } hover:bg-blue-500 transition`}
          >
            👎 Dislike
          </button>

          <button
            onClick={handleSubscribe}
            className={`px-4 py-1 rounded-full ${
              subscribed ? "bg-gray-600 text-white" : "bg-white text-black"
            } hover:opacity-80 transition`}
          >
            {subscribed ? `Subscribed ${video.OwnerDetails[0].subscriberCount}` : `Subscribe ${video.OwnerDetails[0].subscriberCount}`} 
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-3">
        {video.viewsCount.toLocaleString()} views ·{" "}
        {new Date(video.createdAt).toLocaleDateString()}
      </div>

      {/* Description */}
      <div className="bg-[#1f1f1f] p-4 rounded-lg text-sm text-gray-300">
        {video.discription}
      </div>
    </div>
  );
}
