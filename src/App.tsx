import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useCallback, useState } from "react";
import RequestPanel from "@/components/panels/request-panel";
import ResponsePanel from "@/components/panels/response-panel";
import Sidebar from "@/components/sidebar/sidebar";
import TitleBar from "@/components/title-bar";
import WelcomeScreen from "@/components/welcome";
import { useDragResize } from "@/hooks/use-drag-resize";
import useMediaQuery from "@/hooks/use-media-query";
import { useSidebar } from "@/hooks/use-sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { useHttpStore } from "@/store/http-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/utils";
import { overlayAnimations, sidebarAnimations } from "@/utils/animations";

const App = () => {
  const { dragScale, setDragScale } = useUIStore();
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [isDragging, setIsDragging] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toggleSidebar, disableSidebar, activeSidebar, sidebarVisible } =
    useSidebar(isMobile);
  const { activeRequestId } = useHttpStore();

  const { containerRef, handleMouseDown } = useDragResize({
    setDragScale,
    isDragging,
    setIsDragging,
  });

  const handleTabChange = useCallback((tab: "request" | "response") => {
    setActiveTab(tab);
  }, []);

  return (
    <ThemeProvider>
      <div className="h-screen bg-background flex flex-col select-none overflow-hidden">
        <TitleBar />

        {isMobile && (
          <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="w-9" />
          </div>
        )}

        {!isMobile && (
          <button
            type="button"
            className="absolute left-0 top-0 w-1 h-full z-50 bg-transparent hover:bg-primary hover:opacity-20"
            onMouseEnter={() => activeSidebar()}
          />
        )}

        <AnimatePresence>
          {isMobile && sidebarVisible && (
            <motion.div
              {...overlayAnimations}
              className="fixed inset-0 z-30"
              onClick={() => disableSidebar()}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarVisible && (
            <motion.div
              {...(isMobile
                ? sidebarAnimations.mobile
                : sidebarAnimations.desktop)}
              className={cn(
                isMobile
                  ? "fixed left-0 top-0 z-40 h-full w-80 min-w-[280px] max-w-[85vw]"
                  : "absolute left-0 top-0 z-40 h-full",
              )}
            >
              <Sidebar
                visible={sidebarVisible}
                onMouseLeave={() => !isMobile && disableSidebar()}
                className="h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative z-10">
          {!isMobile ? (
            <div
              className="flex-1 flex overflow-hidden min-h-0"
              ref={containerRef}
            >
              {activeRequestId ? (
                <>
                  <div
                    className="border-r border-border min-w-0 flex flex-col"
                    style={{ width: `${dragScale}%` }}
                  >
                    <RequestPanel />
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "w-1 bg-border hover:bg-primary/50 cursor-col-resize",
                      isDragging && "bg-primary/50",
                    )}
                    onMouseDown={handleMouseDown}
                  />

                  <div
                    className="min-w-0 flex flex-col"
                    style={{ width: `${100 - dragScale}%` }}
                  >
                    <ResponsePanel />
                  </div>
                </>
              ) : (
                <WelcomeScreen />
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {activeRequestId ? (
                <>
                  <div className="bg-background border-b border-border px-4 flex-shrink-0 relative z-10">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleTabChange("request")}
                        className={cn(
                          "flex-1 px-4 py-3 text-sm font-medium",
                          activeTab === "request"
                            ? "text-foreground border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Request
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTabChange("response")}
                        className={cn(
                          "flex-1 px-4 py-3 text-sm font-medium",
                          activeTab === "response"
                            ? "text-foreground border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Response
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-visible min-h-0 flex flex-col">
                    {activeTab === "request" ? (
                      <RequestPanel />
                    ) : (
                      <ResponsePanel />
                    )}
                  </div>
                </>
              ) : (
                <WelcomeScreen />
              )}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
