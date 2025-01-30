import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";

const AuthButton = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      {!isSignedIn && (
        <SignOutButton>
          <div className="flex gap-x-3 h-screen justify-center items-center ">
            <SignInButton>
              <Button className="px-10 outline rounded-full hover:bg-gray-200"></Button>
            </SignInButton>
            <SignUpButton>
              <Button className="px-10 outline rounded-full hover:bg-gray-200">
                Sign up
              </Button>
            </SignUpButton>
          </div>
        </SignOutButton>
      )}
    </>
  );
};

export default AuthButton;
