import React, { useEffect, useState } from "react";
import VideoCard from "../Video/VideoCard";
import axios from "axios";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.REACT_APP_API_URL;
  useEffect(() => {
    axios
      .get(`${apiUrl}/video/getAllVideo?page=1&limit=10`)
      .then((res) => {
        setVideos(res.data.data.video);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <div className="px-4 py-6 min-h-screen bg-[#0f0f0f] text-white">
        <h2 className="text-2xl font-semibold mb-4">Recommended</h2>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <p className="text-gray-400">No videos found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
