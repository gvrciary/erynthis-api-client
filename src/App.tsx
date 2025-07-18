import { Menu } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import RequestPanel from "./components/panels/request-panel";
import ResponsePanel from "./components/panels/response-panel";
import Sidebar from "./components/ui/sidebar";
import WelcomeScreen from "./components/welcome";
import { useDragResize } from "./hooks/ui/useDragResize";
import useMediaQuery from "./hooks/ui/useMediaQuery";
import { useSidebar } from "./hooks/ui/useSidebar";
import { useHttpStore } from "./store/httpStore";
import { useUIStore } from "./store/uiStore";

const App = memo(() => {
  const { dragScale, setDragScale, settings } = useUIStore();
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toggleSidebar, disableSidebar, activeSidebar, sidebarVisible } =
    useSidebar(isMobile);
  const { activeRequestId } = useHttpStore();

  const { containerRef, handleMouseDown } = useDragResize({
    dragScale,
    setDragScale,
    isDragging,
    setIsDragging,
  });

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  const handleTabChange = useCallback((tab: "request" | "response") => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col select-none overflow-hidden">
      {isMobile && (
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
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
        <div
          className="absolute left-0 top-0 w-1 h-full z-50 bg-transparent hover:bg-primary hover:opacity-20"
          onMouseEnter={() => activeSidebar()}
        />
      )}

      {isMobile && (
        <CSSTransition
          nodeRef={overlayRef}
          in={sidebarVisible}
          timeout={{ enter: 150, exit: 150 }}
          classNames="overlay"
          unmountOnExit
          appear
        >
          <div
            ref={overlayRef}
            className="fixed inset-0 z-30"
            onClick={() => disableSidebar()}
          />
        </CSSTransition>
      )}

      <CSSTransition
        nodeRef={sidebarRef}
        in={sidebarVisible}
        timeout={{ enter: isMobile ? 250 : 300, exit: isMobile ? 200 : 250 }}
        classNames={isMobile ? "sidebar-mobile" : "sidebar"}
        unmountOnExit
        appear
      >
        <div
          ref={sidebarRef}
          className={`${
            isMobile
              ? "fixed left-0 top-0 z-40 h-full w-80 min-w-[280px] max-w-[85vw]"
              : "absolute left-0 top-0 z-40 h-full"
          }`}
        >
          <Sidebar
            visible={sidebarVisible}
            onMouseLeave={() => !isMobile && disableSidebar()}
            className="h-full"
          />
        </div>
      </CSSTransition>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative z-10">
        {!isMobile ? (
          <div
            className="flex-1 flex overflow-hidden min-h-0"
            ref={containerRef}
          >
            {activeRequestId ? (
              <>
                <div
                  className="border-r border-border bg-card min-w-0 flex flex-col"
                  style={{ width: `${dragScale}%` }}
                >
                  <RequestPanel />
                </div>

                <div
                  className={`w-1 bg-border hover:bg-primary/50 cursor-col-resize ${
                    isDragging ? "bg-primary/50" : ""
                  }`}
                  onMouseDown={handleMouseDown}
                />

                <div
                  className="bg-card min-w-0 flex flex-col"
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
                <div className="bg-card border-b border-border px-4 flex-shrink-0 relative z-10">
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleTabChange("request")}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${
                        activeTab === "request"
                          ? "text-foreground border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange("response")}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${
                        activeTab === "response"
                          ? "text-foreground border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
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
  );
});

App.displayName = "App";

export default App;
