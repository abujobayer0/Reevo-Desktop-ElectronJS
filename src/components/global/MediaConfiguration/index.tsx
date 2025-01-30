import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
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

  const { register, isPending, onPreset } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );
  return <div>MediaConfiguration</div>;
};

export default MediaConfiguration;
