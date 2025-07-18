import { useCallback } from "react";
import { useHttpStore } from "../../store/httpStore";

export const useHttpHeaders = () => {
  const { getSelectedRequest, addHeader, updateHeader, toggleHeader, removeHeader } =
    useHttpStore();

  const updateHeaderKey = useCallback(
    (id: string, key: string) => {
      const request = getSelectedRequest();
      
      if (!request) return;
      
      const header = request.request.headers.find((h) => h.id === id);
      if (header) {
        updateHeader(id, key, header.value);
      }
    },
    [updateHeader, getSelectedRequest],
  );

  const updateHeaderValue = useCallback(
    (id: string, value: string) => {
      const request = getSelectedRequest();
      
      if (!request) return;
      
      const header = request.request.headers.find((h) => h.id === id);
      if (header) {
        updateHeader(id, header.key, value);
      }
    },
    [updateHeader, getSelectedRequest],
  );

  const enabledHeaders = () => {
    const request = getSelectedRequest();
    
    if (!request) return;
    
    return request.request.headers.filter((header) => header.enabled);
  }

  const hasValidHeaders = () => {
    const request = getSelectedRequest();
    
    if (!request) return;
    
    return request.request.headers.some(
      (header) => header.enabled && header.key.trim() && header.value.trim(),
    );
  }

  return {
    getSelectedRequest,
    enabledHeaders,
    hasValidHeaders,
    addHeader,
    updateHeaderKey,
    updateHeaderValue,
    toggleHeader,
    removeHeader,
  };
};