import { selectSources, StartRecording, StopRecording } from "@/lib/recorder";
import {
  cn,
  onMinimizeApp,
  onMinimizeWebCam,
  onShowApp,
  onShowWebCam,
  videoRecordingTime,
} from "@/lib/utils";
import { Camera, CameraOff, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StudioTray = () => {
  const initialTime = new Date();
  // const [preview, setPreview] = useState(false);
  const [recording, setRecording] = useState(false);
  const [onTimer, setOnTimer] = useState<string>("00:00:00");
  const [count, setCount] = useState(0);
  const [onSources, setOnSources] = useState<
    | {
        screen: string;
        id: string;
        audio: string;
        preset: "HD" | "SD";
        plan: "PRO" | "FREE";
      }
    | undefined
  >(undefined);
  const [webcamVisible, setWebcamVisible] = useState(true);

  const clearTime = () => {
    setOnTimer("00:00:00");
    setCount(0);
  };

  window.ipcRenderer.on("profile-recieved", (event, payload) => {
    console.log(event);

    setOnSources(payload);
  });

  const videoElement = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!recording) return;
    const recordTimeInterval = setInterval(() => {
      let time = count + (new Date().getTime() - initialTime.getTime());
      setCount(time);
      const { length, minute } = videoRecordingTime(time);
      if (onSources?.plan === "FREE" && minute === "05") {
        setRecording(false);
        clearTime();
        StopRecording();
      }
      setOnTimer(length);
      if (time <= 0) {
        setOnTimer("00:00:00");
        clearInterval(recordTimeInterval);
      }
    }, 1);

    return () => clearInterval(recordTimeInterval);
  }, [recording]);

  useEffect(() => {
    if (onSources && onSources.screen) {
      selectSources(onSources, videoElement);
    }
    return () => {
      selectSources(onSources!, videoElement);
    };
  }, [onSources]);

  return !onSources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-2 h-screen">
      {/* {preview && (
        <video
          ref={videoElement}
          autoPlay
          className={cn("w-6/12 bg-white self-end")}
        />
      )} */}
      <div className="rounded-full relative overflow-hidden flex justify-around items-center h-20 w-full border-2 bg-[#171717] draggable border-white/40">
        <div
          {...(onSources && {
            onClick: () => {
              setRecording(true);
              onMinimizeApp();
              StartRecording(onSources);
            },
          })}
          className={cn(
            "non-draggable rounded-full cursor-pointer relative hover:opacity-80",
            recording ? "bg-red-500 w-4 h-4" : "bg-red-400 w-6 h-6"
          )}
        >
          {recording && (
            <span className="absolute -right-16 text-sm top-1/2 transform -translate-y-1/2 text-white">
              {onTimer}
            </span>
          )}
        </div>
        {!recording ? (
          <Pause
            className="non-draggable opacity-50"
            size={20}
            fill="#fff"
            stroke="#fff"
          />
        ) : (
          <Square
            className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150 "
            onClick={() => {
              setRecording(false);
              onShowApp();
              clearTime();
              StopRecording();
            }}
            size={20}
            fill="#fff"
            stroke="#fff"
          />
        )}
        {webcamVisible ? (
          <Camera
            className="non-draggable cursor-pointer text-gray-300 hover:text-white opacity-80 hover:opacity-100 transition"
            size={20}
            onClick={() => {
              onMinimizeWebCam();
              setWebcamVisible(false);
            }}
            stroke="currentColor"
          />
        ) : (
          <CameraOff
            className="non-draggable cursor-pointer text-gray-300 hover:text-white opacity-80 hover:opacity-100 transition"
            size={20}
            onClick={() => {
              onShowWebCam();
              setWebcamVisible(true);
            }}
            stroke="currentColor"
          />
        )}
      </div>
    </div>
  );
};

export default StudioTray;
