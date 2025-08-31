import { getCurrentWindow } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/plugin-os";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";

const TitleBar = () => {
  const [currentPlatform, setCurrentPlatform] = useState<string>(() => {
    if (typeof navigator !== "undefined") {
      if (navigator.userAgent.includes("Mac")) {
        return "macos";
      } else if (navigator.userAgent.includes("Linux")) {
        return "linux";
      } else {
        return "windows";
      }
    }
    return "other";
  });

  const [isMaximized, setIsMaximized] = useState(false);
  const [currentWindow, setCurrentWindow] = useState<any>(null);

  useEffect(() => {
    const initWindow = async () => {
      const window = getCurrentWindow();
      setCurrentWindow(window);

      try {
        const platformName = platform();
        setCurrentPlatform(platformName);
      } catch (error) {
        console.error("Error getting platform:", error);
      }

      try {
        const maximized = await window.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error("Error checking maximized state:", error);
      }
    };

    initWindow();
  }, []);

  const handleMinimize = async () => {
    try {
      await currentWindow?.minimize();
    } catch (error) {
      console.error("Error minimizing window:", error);
    }
  };

  const handleToggleMaximize = async () => {
    try {
      await currentWindow?.toggleMaximize();
      const maximized = await currentWindow?.isMaximized();
      setIsMaximized(maximized);
    } catch (error) {
      console.error("Error toggling maximize:", error);
    }
  };

  const handleClose = async () => {
    try {
      await currentWindow?.close();
    } catch (error) {
      console.error("Error closing window:", error);
    }
  };

  const isLinux = currentPlatform === "linux";

  return (
    <div
      data-tauri-drag-region
      className={`relative flex select-none items-center justify-between bg-background border-b border-border flex-shrink-0 h-8`}
    >
      <div data-tauri-drag-region className="flex items-center justify-center flex-1">
        <h1
          data-tauri-drag-region
          className="text-xs font-medium text-foreground select-none cursor-default"
        >
          Erynthis API Client
        </h1>
      </div>

      {isLinux && (
        <div className="flex items-center">
          <button
            onClick={handleMinimize}
            className="flex h-7 w-10 items-center justify-center transition-colors hover:bg-accent"
            title="Minimize"
          >
            <Minus className="h-3.5 w-3.5 text-foreground" />
          </button>
          <button
            onClick={handleToggleMaximize}
            className="flex h-7 w-10 items-center justify-center transition-colors hover:bg-accent"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-foreground" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="group flex h-7 w-10 items-center justify-center transition-colors hover:bg-red-600"
            title="Close"
          >
            <X className="h-3.5 w-3.5 text-foreground group-hover:text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
