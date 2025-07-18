import { useCallback } from "react";
import { useHttpStore } from "@/store/httpStore";

export const useHttpParams = () => {
  const {
    getSelectedRequest,
    setUrl,
    addParam,
    removeParam,
    updateParam,
    toggleParam,
  } = useHttpStore();
  
  const updateParamKey = useCallback(
    (id: string, key: string) => {
      const request = getSelectedRequest();
      
      if (!request) return;
      
      const param = request.request.params.find((h) => h.id === id);
      if (param) {
        updateParam(id, key, param.value);
      }
    },
    [updateParam, getSelectedRequest],
  );

  const updateParamValue = useCallback(
    (id: string, value: string) => {
      const request = getSelectedRequest();
      
      if (!request) return;
      
      const param = request.request.params.find((h) => h.id === id);
      if (param) {
        updateParam(id, param.key, value);
      }
    },
    [updateParam, getSelectedRequest],
  );

  return {
    getSelectedRequest,
    setUrl,
    addParam,
    removeParam,
    updateParam,
    toggleParam,
    updateParamKey,
    updateParamValue,
  };
};
