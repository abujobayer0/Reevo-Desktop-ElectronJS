import { updateStudioSettingsSchema } from "@/schemas/studio-setting.schema";
import { useZodForm } from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string,
  audio?: string,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  const [onPreset, setPreset] = useState<"HD" | "SD" | undefined>();

  const { register, watch } = useZodForm(updateStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      id: string;
      screen: string;
      audio: string;
      preset: "HD" | "SD";
    }) => {
      return updateStudioSettings(
        data.id,
        data.screen,
        data.audio,
        data.preset
      );
    },
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
    onError: () => {
      toast.error("Failed to update studio settings");
    },
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        screen,
        audio,
        id,
        preset,
        plan,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscription = watch((data) => {
      setPreset(data.preset);
      mutate({
        id,
        screen: data.screen,
        audio: data.audio,
        preset: data.preset,
      });
      window.ipcRenderer.send("media-sources", {
        screen: data.screen,
        audio: data.audio,
        id,
        preset: data.preset,
        plan: data.plan,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset };
};
