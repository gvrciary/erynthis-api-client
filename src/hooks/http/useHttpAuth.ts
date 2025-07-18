import { useCallback } from "react";
import { useHttpStore } from "@/store/httpStore";
import { useHttpHeaders } from "./useHttpHeaders";

type AuthType =
  | "none"
  | "inherit"
  | "basic"
  | "bearer"
  | "apikey"
  | "oauth2"
  | "custom";

export const useHttpAuth = () => {
  const {
    getSelectedRequest,
    addHeader,
    updateHeaderKey,
    updateHeaderValue,
    removeHeader,
  } = useHttpHeaders();
  const { setAuthType, updateCredentials } = useHttpStore();

  const updateAuthHeaders = useCallback(() => {
    const request = getSelectedRequest();
    if (!request) return;

    const credentials = request.request.credentials;

    const authHeaders = request.request.headers.filter(
      (h) =>
        h.key.toLowerCase() === "authorization" ||
        h.key.toLowerCase() === "x-api-key" ||
        h.key.toLowerCase() === credentials.customKey.toLowerCase(),
    );

    authHeaders.forEach((header) => removeHeader(header.id));

    let headerKey = "";
    let headerValue = "";

    switch (request.request.authType) {
      case "basic":
        if (credentials.username && credentials.password) {
          headerKey = "Authorization";
          headerValue = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
        }
        break;

      case "bearer":
        if (credentials.token) {
          headerKey = "Authorization";
          headerValue = `${credentials.tokenType} ${credentials.token}`;
        }
        break;

      case "apikey":
        if (credentials.apiKey && credentials.apiKeyName) {
          if (credentials.apiKeyLocation === "header") {
            headerKey = credentials.apiKeyName;
            headerValue = credentials.apiKey;
          }
        }
        break;

      case "oauth2":
        if (credentials.accessToken) {
          headerKey = "Authorization";
          headerValue = `${credentials.tokenType} ${credentials.accessToken}`;
        }
        break;

      case "custom":
        if (credentials.customKey && credentials.customValue) {
          headerKey = credentials.customKey;
          headerValue = credentials.customValue;
        }
        break;

      default:
        break;
    }

    if (headerKey && headerValue) {
      addHeader();
      setTimeout(() => {
        const request = getSelectedRequest();

        if (!request) return;

        const newHeader =
          request.request.headers[request.request.headers.length - 1];
        if (newHeader) {
          updateHeaderKey(newHeader.id, headerKey);
          updateHeaderValue(newHeader.id, headerValue);
        }
      }, 10);
    }
  }, [
    removeHeader,
    addHeader,
    updateHeaderKey,
    updateHeaderValue,
    getSelectedRequest,
  ]);

  const handleCredentialChange = (field: string, value: string) => {
    updateCredentials(field, value);
    updateAuthHeaders();
  };

  const handleAuthTypeChange = (type: string) => {
    setAuthType(type as AuthType);
    updateAuthHeaders();
  };

  return {
    handleAuthTypeChange,
    updateAuthHeaders,
    handleCredentialChange,
    getSelectedRequest,
  };
};
