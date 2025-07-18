import { useCallback, useMemo } from "react";
import { useHttpStore } from "@/store/httpStore";

export const useRequests = () => {
  const {
    requests,
    folders,
    activeRequestId,
    createRequest,
    deleteRequest,
    setActiveRequest,
    selectResponse,
    deleteResponse,
  } = useHttpStore();

  const activeRequest = useMemo(() => {
    return requests.find((r) => r.id === activeRequestId) || null;
  }, [requests, activeRequestId]);

  const getRequestsByFolder = useCallback(
    (folderId: string) => {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) return [];
      return folder.requests
        .map((requestId) => requests.find((r) => r.id === requestId))
        .filter(Boolean);
    },
    [requests, folders],
  );

  const getUnorganizedRequests = useCallback(() => {
    return requests.filter(
      (req) => !folders.some((folder) => folder.requests.includes(req.id)),
    );
  }, [requests, folders]);

  const getResponseHistory = useCallback(
    (requestId: string) => {
      const request = requests.find((r) => r.id === requestId);
      return request?.responses || [];
    },
    [requests],
  );

  const getSelectedResponse = useCallback(
    (requestId: string) => {
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        if (request.selectedResponseId) {
          return request.responses.find(
            (r) => r.id === request.selectedResponseId,
          );
        }
        return request.responses[0];
      }
      return null;
    },
    [requests],
  );

  return {
    requests,
    activeRequest,
    activeRequestId,
    createRequest,
    deleteRequest,
    setActiveRequest,
    getRequestsByFolder,
    getUnorganizedRequests,
    getResponseHistory,
    getSelectedResponse,
    selectResponse,
    deleteResponse,
  };
};
