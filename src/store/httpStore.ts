import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendHttpRequest } from "../services/httpService";
import type {
  FolderItem,
  RequestItem,
  ResponseHistoryItem,
} from "../types/data";
import type { HttpError, HttpRequest } from "../types/http";
import { generateId } from "../utils";
import { createHttpRequest } from "../utils/http";

export interface HttpStore {
  requests: RequestItem[];
  folders: FolderItem[];
  activeRequestId: string | null;
  isLoading: boolean;

  getSelectedRequest: () => RequestItem | null;
  createRequest: () => string;
  deleteRequest: (requestId: string) => void;
  setActiveRequest: (requestId: string | null) => void;
  updateRequest: (request: HttpRequest) => void;
  createFolder: (name: string) => string;
  deleteFolder: (folderId: string) => void;
  toggleFolder: (folderId: string) => void;
  updateNameToFolder: (folderId: string, name: string) => void;
  addRequestToFolder: (requestId: string, folderId: string) => void;
  removeRequestFromFolder: (requestId: string, folderId: string) => void;
  setMethod: (method: string) => void;
  setUrl: (url: string) => void;
  updateUrlWithParams: () => void;
  setTimeout: (timeout: number) => void;
  setBody: (body: string) => void;
  setAuthType: (auth: string) => void;
  setBodyType: (
    bodyType: "none" | "text" | "form" | "binary" | "graphql",
  ) => void;
  setTextSubtype: (textSubtype: "raw" | "json" | "xml" | "yaml") => void;
  setFormSubtype: (formSubtype: "urlencoded" | "multipart") => void;
  setBinaryFile: (file: File | null) => void;
  addHeader: () => void;
  updateHeader: (id: string, key: string, value: string) => void;
  toggleHeader: (id: string) => void;
  removeHeader: (id: string) => void;
  addParam: () => void;
  updateParam: (id: string, key: string, value: string) => void;
  toggleParam: (id: string) => void;
  removeParam: (id: string) => void;
  sendRequest: () => Promise<void>;
  clearResponse: () => void;
  selectResponse: (requestId: string, responseId: string) => void;
  deleteResponse: (requestId: string, responseId: string) => void;
  setActiveResponseTab: (tab: string) => void;
  setActiveRequestTab: (tab: string) => void;
  updateCredentials: (field: string, value: string) => void;
}

export const useHttpStore = create<HttpStore>()(
  persist(
    (set, get) => ({
      requests: [],
      folders: [],
      activeRequestId: null,
      isLoading: false,

      getSelectedRequest: () => {
        const state = get();
        return (
          state.requests.find((req) => req.id === state.activeRequestId) || null
        );
      },

      createRequest: () => {
        const { requestId, newRequest } = createHttpRequest();

        set((state) => ({
          requests: [...state.requests, newRequest],
          activeRequestId: requestId,
          request: newRequest.request,
        }));

        return requestId;
      },

      deleteRequest: (requestId) => {
        const state = get();
        const filtered = state.requests.filter((req) => req.id !== requestId);
        const last = filtered[filtered.length - 1] ?? null;
        const newRequestID =
          state.activeRequestId === requestId && last ? last.id : null;
        set((state) => ({
          requests: filtered,
          folders: state.folders.map((folder) => ({
            ...folder,
            requests: folder.requests.filter((id) => id !== requestId),
          })),
          activeRequestId: newRequestID,
        }));
      },

      setActiveRequest: (requestId: string | null) => {
        set({
          activeRequestId: requestId,
        });
      },

      updateRequest: (request) => {
        const state = get();
        if (!state.activeRequestId) return;

        set((prevState) => ({
          requests: prevState.requests.map((req) =>
            req.id === state.activeRequestId
              ? { ...req, request, updatedAt: Date.now() }
              : req,
          ),
        }));
      },

      createFolder: (name) => {
        const folderId = generateId("folder");
        const newFolder: FolderItem = {
          id: folderId,
          name,
          expanded: true,
          requests: [],
        };

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));

        return folderId;
      },

      deleteFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== folderId),
        }));
      },

      toggleFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId
              ? { ...folder, expanded: !folder.expanded }
              : folder,
          ),
        }));
      },

      addRequestToFolder: (requestId, folderId) => {
        set((state) => ({
          folders: state.folders.map((folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                requests: [
                  ...folder.requests.filter((id) => id !== requestId),
                  requestId,
                ],
              };
            }
            return {
              ...folder,
              requests: folder.requests.filter((id) => id !== requestId),
            };
          }),
        }));
      },
      updateNameToFolder: (folderId, name) => {
        const state = get();
        const folder = state.folders.find((f) => f.id === folderId);
        const existName = state.folders.some(
          (f) => f.name.toLowerCase() === name.toLowerCase(),
        );
        if (
          !folder ||
          folder.name.toLowerCase() === name.toLowerCase() ||
          existName
        )
          return;
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, name } : folder,
          ),
        }));
      },

      updateUrlWithParams: () => {
        set((state) => {
          const requestItem = state.getSelectedRequest();
          if (!requestItem) return {};

          const params = requestItem.request.params;
          const baseUrl = requestItem.request.url.split("?")[0] || "";
          const enabledParams = params.filter(
            (p) => p.enabled && p.key.trim() && p.value.trim(),
          );

          if (enabledParams.length === 0) {
            requestItem.request.url = baseUrl;
            return { requests: [...state.requests] };
          }

          const queryString = enabledParams
            .map(
              (p) =>
                `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`,
            )
            .join("&");

          requestItem.request.url = `${baseUrl}?${queryString}`;
          return { requests: [...state.requests] };
        });
      },

      removeRequestFromFolder: (requestId, folderId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId
              ? {
                  ...folder,
                  requests: folder.requests.filter((id) => id !== requestId),
                }
              : folder,
          ),
        }));
      },

      setMethod: (method) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.method = method;
        state.updateRequest(requestItem.request);
      },

      setUrl: (url) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.url = url;
        state.updateRequest(requestItem.request);
      },

      setTimeout: (timeout) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.timeout = timeout;
        state.updateRequest(requestItem.request);
      },

      setBody: (body) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.body = body;
        state.updateRequest(requestItem.request);
      },

      setAuthType: (auth) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.authType = auth;
        state.updateRequest(requestItem.request);
      },

      setBodyType: (bodyType) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.bodyType = bodyType;
        state.updateRequest(requestItem.request);
      },

      setTextSubtype: (textSubtype) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.textSubtype = textSubtype;
        state.updateRequest(requestItem.request);
      },

      setFormSubtype: (formSubtype) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.formSubtype = formSubtype;
        state.updateRequest(requestItem.request);
      },

      setBinaryFile: (binaryFile) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.binaryFile = binaryFile;
        state.updateRequest(requestItem.request);
      },

      addHeader: () => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.headers.push({
          id: generateId("header"),
          key: "",
          value: "",
          enabled: false,
        });
        state.updateRequest(requestItem.request);
      },

      updateHeader: (id, key, value) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.headers = requestItem.request.headers.map(
          (header) => (header.id === id ? { ...header, key, value } : header),
        );
        state.updateRequest(requestItem.request);
      },

      toggleHeader: (id) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.headers = requestItem.request.headers.map(
          (header) =>
            header.id === id ? { ...header, enabled: !header.enabled } : header,
        );
        state.updateRequest(requestItem.request);
      },

      removeHeader: (id) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.headers = requestItem.request.headers.filter(
          (header) => header.id !== id,
        );
        state.updateRequest(requestItem.request);
      },

      addParam: () => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.params.push({
          id: generateId("param"),
          key: "",
          value: "",
          enabled: false,
        });
        state.updateRequest(requestItem.request);
        state.updateUrlWithParams();
      },

      updateParam: (id, key, value) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.params = requestItem.request.params.map((param) =>
          param.id === id ? { ...param, key, value } : param,
        );
        state.updateRequest(requestItem.request);
        state.updateUrlWithParams();
      },

      toggleParam: (id) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.params = requestItem.request.params.map((param) =>
          param.id === id ? { ...param, enabled: !param.enabled } : param,
        );
        state.updateRequest(requestItem.request);
        state.updateUrlWithParams();
      },

      removeParam: (id) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.params = requestItem.request.params.filter(
          (param) => param.id !== id,
        );
        state.updateRequest(requestItem.request);
        state.updateUrlWithParams();
      },

      sendRequest: async () => {
        const state = get();
        const { activeRequestId } = state;
        const request = state.getSelectedRequest()?.request;

        if (!request || !activeRequestId) return;
        const responseId = generateId("response");

        set({ isLoading: true });

        try {
          const response = await sendHttpRequest(request);

          set({ isLoading: false });

          const responseItem: ResponseHistoryItem = {
            id: responseId,
            timestamp: Date.now(),
            response,
          };

          set((prevState) => ({
            requests: prevState.requests.map((req) => {
              if (req.id === activeRequestId) {
                return {
                  ...req,
                  request,
                  responses: [responseItem, ...req.responses],
                  updatedAt: Date.now(),
                };
              }
              return req;
            }),
          }));
        } catch (error: any) {
          const httpError: HttpError = {
            error: error.error || "Unknown error occurred",
            status: error.status || 404,
          };

          set({ isLoading: false });

          const errorItem: ResponseHistoryItem = {
            id: responseId,
            timestamp: Date.now(),
            error: httpError,
          };

          set((prevState) => ({
            requests: prevState.requests.map((req) => {
              if (req.id === activeRequestId) {
                return {
                  ...req,
                  request,
                  responses: [errorItem, ...req.responses],
                  updatedAt: Date.now(),
                };
              }
              return req;
            }),
          }));
        } finally {
          state.selectResponse(activeRequestId, responseId);
        }
      },

      clearResponse: () => {
        const state = get();
        const { activeRequestId } = state;
        if (!activeRequestId) return;

        set((prevState) => ({
          requests: prevState.requests.map((req) =>
            req.id === activeRequestId
              ? { ...req, responses: [], selectedResponseId: undefined }
              : req,
          ),
        }));
      },

      selectResponse: (requestId, responseId) => {
        const state = get();
        const request = state.requests.find((req) => req.id === requestId);

        if (request) {
          const selectedResponse = request.responses.find(
            (r) => r.id === responseId,
          );
          if (selectedResponse) {
            set((prevState) => ({
              response: selectedResponse.response || null,
              error: selectedResponse.error || null,
              requests: prevState.requests.map((req) =>
                req.id === requestId
                  ? { ...req, selectedResponseId: responseId }
                  : req,
              ),
            }));
          }
        }
      },

      deleteResponse: (requestId, responseId) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  responses: request.responses.filter(
                    (r) => r.id !== responseId,
                  ),
                  selectedResponseId:
                    request.selectedResponseId === responseId
                      ? undefined
                      : request.selectedResponseId,
                }
              : request,
          ),
        }));
      },
      setActiveRequestTab: (tab) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.activeRequestTab = tab;
        state.updateRequest(requestItem.request);
      },
      setActiveResponseTab: (tab) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.activeResponseTab = tab;
        state.updateRequest(requestItem.request);
      },

      updateCredentials: (field, value) => {
        const state = get();
        const requestItem = state.getSelectedRequest();
        if (!requestItem) return;

        requestItem.request.credentials = {
          ...requestItem.request.credentials,
          [field]: value,
        };
        state.updateRequest(requestItem.request);
      },
    }),
    {
      name: "http-store",
      partialize: (state) => ({
        requests: state.requests,
        folders: state.folders,
        activeRequestId: state.activeRequestId,
      }),
    },
  ),
);
