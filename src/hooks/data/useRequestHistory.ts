import { useCallback, useMemo } from "react";
import { useHttpStore } from "@/store/httpStore";

export const useRequestHistory = () => {
  const { requests, setActiveRequest } = useHttpStore();

  const history = useMemo(() => {
    const allRequests = requests.map((request) => ({
      id: request.id,
      name: request.name,
      method: request.request.method,
      url: request.request.url,
      timestamp: request.updatedAt,
      request: request.request,
      response: request.responses[0]?.response,
      error: request.responses[0]?.error,
      responseCount: request.responses.length,
    }));

    return allRequests.sort((a, b) => b.timestamp - a.timestamp);
  }, [requests]);

  const recentRequests = useMemo(() => {
    return history.slice(0, 10);
  }, [history]);

  const searchHistory = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return history.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.method.toLowerCase().includes(lowercaseQuery) ||
          item.url.toLowerCase().includes(lowercaseQuery),
      );
    },
    [history],
  );

  const loadFromHistory = useCallback(
    (id: string) => {
      setActiveRequest(id);
    },
    [setActiveRequest],
  );

  const removeFromHistory = useCallback((id: string) => {
    useHttpStore.getState().deleteRequest(id);
  }, []);

  return {
    history,
    recentRequests,
    searchHistory,
    loadFromHistory,
    removeFromHistory,
  };
};
