import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaExpand } from "react-icons/fa";
import { useParams } from "react-router";
import { FiSettings } from "react-icons/fi";
import VideoDetails from "../Video/VideoDetails";
import { videoById } from "../../api/videoApi";

export default function VideoPlayer() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [quality, setQuality] = useState("360p");
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    videoById(id)
      .then((res) => setVideo(res.data.data))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleVolume = (e) => {
    const vol = e.target.value / 100;
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const getVideoUrlByQuality = (label) => {
    const qualityObj = video?.qualities?.find((q) => q.label === label);
    return qualityObj?.url;
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  // console.log(video);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
      setProgress((videoEl.currentTime / videoEl.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoEl.duration);
    };
    const handleVideoEnde = () => {
      setPlaying(false);
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoEl.addEventListener("ended", handleVideoEnde);

    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoEl.removeEventListener("ended", handleVideoEnde);
    };
  }, [video]);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
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
      <div className="relative bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          src={getVideoUrlByQuality(quality)}
          className="w-full max-h-[500px] rounded"
        />

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="absolute bottom-[52px] left-0 right-0 w-full h-1 bg-red-600 appearance-none cursor-pointer"
          style={{
            accentColor: "#f87171",
            height: "4px",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-black/70 text-white text-sm">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            <div className="flex items-center gap-2">
              <FaVolumeUp />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolume}
                className="w-20"
              />
            </div>

            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowQualityOptions(!showQualityOptions)}
              >
                <FiSettings size={18} />
              </button>
              {showQualityOptions && (
                <div className="absolute bottom-8 right-0 bg-[#1f1f1f] border border-gray-700 rounded shadow-lg">
                  {video.qualities.map((q) => (
                    <div
                      key={q.label}
                      className={`px-4 py-1 cursor-pointer hover:bg-gray-700 ${
                        quality === q ? "text-blue-400" : "text-white"
                      }`}
                      onClick={() => {
                        setQuality(q.label);
                        setShowQualityOptions(false);
                      }}
                    >
                      {q.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleFullscreen}>
              <FaExpand />
            </button>
          </div>
        </div>
      </div>
      <VideoDetails
        videoName={video.title}
        channel={video.OwnerDetails[0]}
        likes={video.likes}
        views={video.name}
        subscribers={video.OwnerDetails[0].subscriberCount}
        description = {video.discription}
      />
    </>
  );
}
