import { useEffect, useState } from "react";

export const useSidebar = (isMobile: boolean) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        const nearLeftEdge = e.clientX <= 20;
        const inSidebarArea = e.clientX <= 320;

        const hasOpenModals =
          document.querySelector(".fixed.z-50, .fixed.inset-0") !== null;

        if (nearLeftEdge && !sidebarVisible) {
          setSidebarVisible(true);
        }
        if (
          sidebarVisible &&
          !inSidebarArea &&
          e.clientX > 340 &&
          !hasOpenModals
        ) {
          setSidebarVisible(false);
        }
      };

      const handleMouseLeave = () => {
        const hasOpenModals =
          document.querySelector(".fixed.z-50, .fixed.inset-0") !== null;

        if (sidebarVisible && !hasOpenModals) {
          setSidebarVisible(false);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [sidebarVisible, isMobile]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const disableSidebar = () => setSidebarVisible(false);
  const activeSidebar = () => setSidebarVisible(true);

  return {
    toggleSidebar,
    disableSidebar,
    activeSidebar,
    sidebarVisible,
  };
};
