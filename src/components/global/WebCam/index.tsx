import { useEffect, useRef } from "react";

const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);
  const streamWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (camElement.current) {
      camElement.current.srcObject = stream;
      await camElement.current.play();
    }
  };
  useEffect(() => {
    streamWebcam();
  }, []);

  return (
    <div className="relative">
      <video
        ref={camElement}
        className="h-screen draggable object-cover rounded-full aspect-video border-2 relative border-white"
      />
    </div>
  );
};

export default WebCam;
