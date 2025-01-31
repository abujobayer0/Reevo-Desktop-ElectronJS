import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { LogIn, UserPlus } from "lucide-react";

const AuthButton = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { isSignedIn } = useUser();
  if (isSignedIn) return null;
  return (
    <div className="relative flex justify-center items-center">
      <div className="flex flex-col items-center">
        {isRegister ? (
          <SignUpButton>
            <Button className="px-10 py-3 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#5e17eb] text-white font-medium shadow-lg transition-all duration-300 hover:brightness-125 hover:scale-105">
              <UserPlus className="mr-2" /> Sign up
            </Button>
          </SignUpButton>
        ) : (
          <SignInButton>
            <Button className="px-10 py-3 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#5e17eb] text-white font-medium shadow-lg transition-all duration-300 hover:brightness-125 hover:scale-105">
              <LogIn className="mr-2" /> Sign in
            </Button>
          </SignInButton>
        )}

        <p className="mt-3 text-sm text-gray-500">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <span
            className="text-[#8c52ff] font-medium cursor-pointer hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Sign in" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthButton;
