import React, { useEffect, useState } from "react";
import { useQuery } from "../../Hooks/CustomHooks/useQuery";
import VideoCard from "../Video/VideoCard";
import axios from "axios";

export default function SearchResult() {
  const apiUrl = import.meta.env.REACT_APP_API_URL;

  const query = useQuery().get("query") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      axios
        .get(
          `${apiUrl}/video/getVideoBySearch/query=${encodeURIComponent(
            query
          )}&page=1&limit=10`
        )
        .then((response) => {
          setVideos(response.data.data.video);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <>
      <div className="px-4 py-6 min-h-screen bg-[#0f0f0f] text-white">
        <h2 className="text-2xl font-semibold mb-6">
          Results for "<span className="text-red-500">{query}</span>"
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-400">No videos found for your search.</p>
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
