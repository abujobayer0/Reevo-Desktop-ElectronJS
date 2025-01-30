import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpsClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getMediaResources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");
  const enumerateDevices =
    await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumerateDevices.filter(
    (device) => device.kind === "audioinput"
  );

  console.log("Getting media resources.");

  return { displays, audio: audioInputs };
};

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const response = await httpsClient.post(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};
