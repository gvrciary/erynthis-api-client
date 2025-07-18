import { useCallback } from "react";
import { useHttpStore } from "../../store/httpStore";

export const useFolders = () => {
  const {
    folders,
    createFolder,
    deleteFolder,
    toggleFolder,
    addRequestToFolder,
    removeRequestFromFolder,
  } = useHttpStore();

  const getFolderById = useCallback(
    (folderId: string) => {
      return folders.find((f) => f.id === folderId) || null;
    },
    [folders],
  );

  const getFolderByRequestId = useCallback(
    (requestId: string) => {
      return folders.find((f) => f.requests.includes(requestId)) || null;
    },
    [folders],
  );

  return {
    folders,
    createFolder,
    deleteFolder,
    toggleFolder,
    addRequestToFolder,
    removeRequestFromFolder,
    getFolderById,
    getFolderByRequestId,
  };
};
