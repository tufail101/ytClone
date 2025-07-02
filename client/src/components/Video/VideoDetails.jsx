import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegSave,
  FaUserCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { toggleVideoLike } from "../../api/likeApi";
import { useParams } from "react-router";

export default function VideoDetails({
  videoName,
  channel,
  likes,
  views,
  subscribers,
  description,
}) {
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  // console.log(channel);

  const getShortDescription = (text) => {
    const lines = text.split("\n");
    return lines.slice(0, 2).join("\n");
  };

  const handleLike = () => {
    toggleVideoLike(id)
      .then((res) => {
        console.log(res.data);
        const liked = res.data.data.isLiked

        setIsLiked(liked);
        if (res.data.isLiked) {
          setLikeCount((prev) =>liked ?  prev + 1 : prev - 1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="text-white px-4 py-4">
      <h1 className="text-xl sm:text-2xl font-semibold mb-3">{videoName}</h1>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img src={channel.avatar} size={32} className="text-gray-400 h-6" />
          <div>
            <p className="text-sm font-medium">{channel.name}</p>
            <p className="text-xs text-gray-400">{channel.name}</p>
          </div>
        </div>
        <button className="bg-white text-black font-semibold text-sm px-5 py-1.5 rounded-full hover:opacity-90 transition">
          Subscribe {subscribers}
        </button>
      </div>

      <div className="flex gap-6 text-sm text-gray-300 mb-3">
        <button
          className={`flex items-center gap-2 transition ${
    isLiked ? 'text-blue-500' : 'text-gray-300 hover:text-white'
  }`}
          onClick={handleLike}
        >
          <FaThumbsUp />
          <span>{likeCount}</span>
        </button>
        <button
          className={`flex items-center gap-2 hover:text-white transition active:text-blue-600 '}`}
        >
          <FaThumbsDown />
          <span></span>
        </button>
      </div>

      <div className="text-xs text-gray-400 ">
        {/* <p className="mb-1">{views} • 2 days ago</p> */}
        <p className="mb-1">{views}</p>

        <div className="whitespace-pre-line text-xs text-gray-400 leading-relaxed mb-10">
          <p>
            {showFullDescription
              ? description
              : getShortDescription(description)}
          </p>

          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-400 hover:underline font-medium"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
    </div>
  );
}
