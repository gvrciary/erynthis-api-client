import { useCallback, useEffect, useRef } from 'react';

interface UseDragResizeProps {
  setDragScale: (scale: number) => void;
  minWidth?: number;
  maxWidth?: number;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

interface UseDragResizeReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export const useDragResize = ({
  setDragScale,
  minWidth = 47,
  maxWidth = 70,
  isDragging,
  setIsDragging,
}: UseDragResizeProps): UseDragResizeReturn => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, [setIsDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
      setDragScale(clampedWidth);
    },
    [isDragging, setDragScale, minWidth, maxWidth],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    containerRef,
    handleMouseDown,
  };
};
