import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { Spinner } from "../Loader";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaSources } from "@/hooks/useMediaSources";
import MediaConfiguration from "../MediaConfiguration";

const Widget = () => {
  const [profile, setProfile] = useState<{
    status: number;
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
  } | null>(null);

  const { state, fetchMediaResources } = useMediaSources();
  const { user } = useUser();

  useEffect(() => {
    fetchMediaResources();
    if (user && user.id) {
      fetchUserProfile(user.id).then((p) => setProfile(p));
    }
  }, [user]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Spinner />
        </div>
      </ClerkLoading>

      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile.user} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
