import { RefObject } from "react";
import { hidePluginWindow } from "./utils";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import { ElectronMediaConstraints } from "../types/electron";
let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder = new MediaRecorder(new MediaStream());
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

export const StartRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuidv4()}-${onSources.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const StopRecording = () => {
  mediaRecorder.stop();
  window.ipcRenderer.send(
    "open-external-link",
    "http://localhost:3000/dashboard"
  );
};

export const onDataAvailable = (data: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: data.data,
    filename: videoTransferFileName,
  });
};
const onstoprecording = () => {
  hidePluginWindow(false);
  if (userId) {
    socket.emit("process-video", {
      filename: videoTransferFileName,
      userId: userId,
    });
  }
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources.screen,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 30,
        },
      },
    } as ElectronMediaConstraints;

    userId = onSources.id;

    const stream = await (navigator.mediaDevices.getUserMedia(
      constraints
    ) as Promise<MediaStream>);
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: onSources.audio ? { deviceId: { exact: onSources.audio } } : false,
      video: false,
    });

    if (videoElement && videoElement.current) {
      videoElement.current.srcObject = stream;
      videoElement.current.width =
        stream.getVideoTracks()[0].getSettings().width || 1280;
      videoElement.current.height =
        stream.getVideoTracks()[0].getSettings().height || 720;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm;codecs=vp9",
    });
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = onstoprecording;
  }
};
