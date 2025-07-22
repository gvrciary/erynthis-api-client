export const sidebarAnimations = {
  desktop: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: {
      duration: 0.28,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },

  mobile: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export const overlayAnimations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
};
