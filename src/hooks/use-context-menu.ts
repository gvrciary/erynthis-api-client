import { useCallback, useState } from "react";

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
}

export interface UseContextMenuReturn {
  contextMenu: ContextMenuState;
  openContextMenu: (event: React.MouseEvent) => void;
  closeContextMenu: () => void;
  handleContextMenu: (event: React.MouseEvent) => void;
}

export const useContextMenu = (): UseContextMenuReturn => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const openContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { clientX, clientY } = event;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const menuWidth = 200;
    const menuHeight = 150;

    let x = clientX;
    let y = clientY;

    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }

    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    x = Math.max(10, x);
    y = Math.max(10, y);

    setContextMenu({
      isOpen: true,
      position: { x, y },
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    openContextMenu(event);
  }, [openContextMenu]);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleContextMenu,
  };
};
