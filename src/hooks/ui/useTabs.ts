import { useCallback, useState } from 'react';

interface UseTabsProps<T extends string> {
  defaultTab: T;
  tabs: readonly T[];
}

interface UseTabsReturn<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  isActiveTab: (tab: T) => boolean;
  nextTab: () => void;
  prevTab: () => void;
  tabIndex: number;
  totalTabs: number;
}

export const useTabs = <T extends string>({
  defaultTab,
  tabs,
}: UseTabsProps<T>): UseTabsReturn<T> => {
  const [activeTab, setActiveTabState] = useState<T>(defaultTab);

  const setActiveTab = useCallback((tab: T) => {
    if (tabs.includes(tab)) {
      setActiveTabState(tab);
    }
  }, [tabs]);

  const isActiveTab = useCallback((tab: T) => {
    return activeTab === tab;
  }, [activeTab]);

  const tabIndex = tabs.indexOf(activeTab);

  const nextTab = useCallback(() => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTabState(tabs[nextIndex]);
  }, [activeTab, tabs]);

  const prevTab = useCallback(() => {
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTabState(tabs[prevIndex]);
  }, [activeTab, tabs]);

  return {
    activeTab,
    setActiveTab,
    isActiveTab,
    nextTab,
    prevTab,
    tabIndex,
    totalTabs: tabs.length,
  };
};
