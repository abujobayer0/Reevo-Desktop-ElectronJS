import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Spinner } from "../Loader";
import { Headphones, Monitor, Settings } from "lucide-react";

type Props = {
  state: SourceDeviceStateProps;
  user:
    | ({
        subscription: {
          plan: "PRO" | "FREE";
        } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          preset: "HD" | "SD";
          camera: string | null;
          userId: string | null;
        } | null;
      } & {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        clerkId: string;
        createdAt: string;
      })
    | null;
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state?.displays?.find(
    (display) => display.id === user?.studio?.screen
  );
  const activeMic = state?.audioInputs?.find(
    (audio) => audio.deviceId === user?.studio?.mic
  );

  const { isPending, register, onPreset } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );
  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor size={36} fill="#575655" color="#575655" />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.displays?.map((display) => (
            <option
              key={display.id}
              selected={activeScreen && activeScreen.id === display.id}
              className="bg-[#171717] cursor-pointer"
              value={display.id}
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Headphones size={36} color="#575655" />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.audioInputs?.map((audio) => (
            <option
              key={audio.deviceId}
              className="bg-[#171717] cursor-pointer"
              selected={activeMic && activeMic.deviceId === audio.deviceId}
              value={audio.deviceId}
            >
              {audio.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Settings size={36} color="#575655" />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          <option
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPreset === "HD" || user?.studio?.preset === "HD"}
            className="bg-[#171717] cursor-pointer"
            value="HD"
          >
            1080p {user?.subscription?.plan === "FREE" && "Upgrade to PRO plan"}
          </option>
          <option
            value="SD"
            selected={onPreset === "SD" || user?.studio?.preset === "SD"}
            className="bg-[#171717] cursor-pointer"
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
