import React, { useState } from "react";
import { ReactComponent as TrashIcon } from "../img/bin.svg"; // Replace with your delete icon
import { ReactComponent as PlayIcon } from "../img/play.svg"; // Replace with your play icon
import { GetCorrectedLink } from "../utils/getCorrectedLink";

const CustomVideoPlayer = ({ src, onDelete }: { src: string; onDelete: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-[212px] h-full rounded-xl overflow-hidden bg-gray-200 group">
      {/* Video */}
      <video
        ref={videoRef}
        src={src?.includes("blob") ? src : GetCorrectedLink(src)}
        className="w-full h-full object-cover rounded-xl"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        controls={false}
      />

      {/* Play Button on Hover */}
      <div
        onClick={handlePlayPause}
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      >
        <PlayIcon className="w-12 h-12 fill-black" />
      </div>

      {/* Delete Button */}
      <div
        onClick={onDelete}
        className="absolute top-2 right-2 bg-[#FFFFFF33] bg-opacity-70 rounded-lg p-2 cursor-pointer"
      >
        <TrashIcon className="w-6 h-6 fill-white" />
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
