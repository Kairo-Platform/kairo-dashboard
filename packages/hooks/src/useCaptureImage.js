import { useRef, useState } from "react";

const defaultConstraints = {
  video: {
    width: {
      max: 1200,
    },
    height: {
      max: 1200,
    },
    aspectRatio: { ideal: 1 },
    facingMode: "user", // user for front camera
    // facingMode: 'environment', // environment for back camera
  },
};

export const useCaptureImage = ({
  constraints = defaultConstraints,
  quality = 1,
} = {}) => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        ...constraints,
      })
      .then((mediaStream) => {
        if (videoRef.current == null) {
          setError(new Error("video element is null"));
          return;
        }
        videoRef.current.srcObject = mediaStream;
        setMediaStream(mediaStream);
      })
      .catch((error) => setError(error));
  };

  const stopCamera = () => {
    mediaStream?.getVideoTracks().forEach((device) => device.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    return new Promise((resolve, reject) => {
      if (videoRef.current == null) {
        return reject(new Error("video element is null"));
      }

      // Get the resolution of the video
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const canvasContext = canvas.getContext("2d");
      if (canvasContext == null) return;

      canvasContext.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      canvas.toBlob(
        (blob) => {
          if (blob == null) {
            setError(new Error("failed to capture image"));
            return;
          }

          return resolve(blob);
        },
        "image/jpeg",
        quality,
      );
    });
  };

  return {
    error,
    setError,
    startCamera,
    stopCamera,
    captureImage,
    videoRef,
    mediaStream,
  };
};
