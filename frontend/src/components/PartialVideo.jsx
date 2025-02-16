import React, { useEffect, useRef } from "react";
import { GetCorrectedLink, GetCorrectedLinkImg } from "../utils/getCorrectedLink";

const TestVideoPlayerJS = ({ videoUrl, previewImage }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    playerRef.current = new window.Playerjs({
      id: "playerjs-container",
      file: GetCorrectedLink(videoUrl),
      poster: previewImage || "",
      autoplay: false,
    });
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video w-full h-full">
      {/* PlayerJS Container */}
      {videoUrl ? (
        <div id="playerjs-container" ref={playerRef} className="video-container" />
      ) : (
        <img src={GetCorrectedLinkImg(previewImage)} alt="img" />
      )}
    </div>
  );
};

export default TestVideoPlayerJS;
