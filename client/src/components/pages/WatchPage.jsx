import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { videoById } from "../../api/videoApi";
import { FiSettings } from "react-icons/fi";

export default function WatchPage() {
  const { id } = useParams();
  const apiUrl = import.meta.env.REACT_APP_API_URL;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [currentQuelity, setCurrentQuelity] = useState("360p");
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);

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
    setLiked(false);
    setDisliked(true);
  };

  useEffect(() => {
    setLoading(true);
    videoById(id)
      .then((res) => {
        setVideo(res.data.data);
        setCurrentQuelity("360p");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleQualityChange = (e) => {
    setCurrentQuelity(e.target.value);
  };
  const getVideoUrlByQuality = (label) => {
    const qualityObj = video?.qualities?.find((q) => q.label === label);
    return qualityObj?.url || video.videourl;
  };

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
    <>
<div className="relative w-full max-h-[500px] mb-4">
  {/* Video Player */}
  <video
    key={currentQuelity}
    src={getVideoUrlByQuality(currentQuelity)}
    controls
    className="w-full max-h-[500px] rounded-lg"
  />

  {/* Quality Switcher - Positioned above the video controls */}
  <div className="absolute bottom-16 right-6 z-30">
    <div className="relative">
      {/* Gear Icon Button */}
      <button
        onClick={() => setShowQualityDropdown(!showQualityDropdown)}
        className="p-2 bg-black/70 rounded-full text-white hover:bg-black/90"
        title="Settings"
      >
        <FiSettings size={20} />
      </button>

      {/* Dropdown Options */}
      {showQualityDropdown && (
        <div className="absolute bottom-full mb-2 right-0 bg-black text-white rounded-md shadow-lg w-24 text-sm">
          {video.qualities.map((q) => (
            <div
              key={q.label}
              onClick={() => {
                setCurrentQuelity(q.label);
                setShowQualityDropdown(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                currentQuelity === q.label ? "bg-gray-800 font-bold" : ""
              }`}
            >
              {q.label}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>


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
            <p className="text-gray-400 text-sm">
              @{video.OwnerDetails[0].username}
            </p>
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
            {subscribed
              ? `Subscribed ${video.OwnerDetails[0].subscriberCount}`
              : `Subscribe ${video.OwnerDetails[0].subscriberCount}`}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-3">
        {video.viewsCount.toLocaleString()} views ·{" "}
        {new Date(video.createdAt).toLocaleDateString()}
      </div>

      <div className="bg-[#1f1f1f] p-4 rounded-lg text-sm text-gray-300">
        {video.discription}
      </div>
    
    </>
  );
}
