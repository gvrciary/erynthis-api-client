import { useCallback } from "react";
import { useHttpStore } from "@/store/http-store";

export const useHttpRequest = () => {
  const {
    requests,
    getSelectedRequest,
    isLoading,
    activeRequestId,
    setMethod,
    setUrl,
    setTimeout,
    setBody,
    setBodyType,
    setTextSubtype,
    setFormSubtype,
    setBinaryFile,
    sendRequest,
    clearResponse,
    selectResponse,
    deleteResponse,
    setActiveRequestTab,
    setActiveResponseTab,
  } = useHttpStore();

  const executeRequest = useCallback(async () => {
    const request = getSelectedRequest();
    if (!request) return;

    if (!request.request.url.trim()) return;

    try {
      await sendRequest();
    } catch {}
  }, [sendRequest, getSelectedRequest]);

  const isValidRequest = () => {
    const request = getSelectedRequest();
    if (!request) return false;

    return request.request.url.trim().length > 0;
  };

  return {
    requests,
    getSelectedRequest,
    isLoading,
    isValidRequest,
    activeRequestId,
    setMethod,
    setUrl,
    setTimeout,
    setBody,
    setBodyType,
    setTextSubtype,
    setFormSubtype,
    setBinaryFile,
    executeRequest,
    clearResponse,
    selectResponse,
    deleteResponse,
    setActiveRequestTab,
    setActiveResponseTab,
  };
};
