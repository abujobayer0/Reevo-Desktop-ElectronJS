import { Button } from "@/components/ui/button";
import { cn, onCloseApp, onMinimizeApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X, Minus } from "lucide-react";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);
    setIsVisible(payload.state);
  });

  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "bg-[#171717] border-2 border-neutral-700 flex px-1 flex-col rounded-3xl overflow-hidden "
      )}
    >
      <div className="flex justify-between w-full items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <div className="flex gap-2 items-center">
          <Button
            size={"sm"}
            onClick={onMinimizeApp}
            className="text-gray-400 z-10 non-draggable bg-transparent hover:bg-transparent hover:text-white"
          >
            <Minus size={40} />
          </Button>
          <Button
            size={"sm"}
            className="text-gray-400 non-draggable hover:text-red-500 z-10 bg-transparent hover:bg-transparent "
            onClick={onCloseApp}
          >
            <X size={40} />
          </Button>
        </div>
      </div>
      <div className="flex-1  h-0 overflow-auto">{children}</div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" className="w-10 h-10" alt="" />
          <p className="text-white text-2xl ">Reevo</p>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
