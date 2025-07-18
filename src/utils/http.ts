import type { RequestItem } from "../types/data";
import { generateId } from "../utils";

export const createHttpRequest = (): {
  newRequest: RequestItem;
  requestId: string;
} => {
  const requestId = generateId("request");
  const now = Date.now();
  const defaultName = `Request`;

  const newRequest: RequestItem = {
    id: requestId,
    name: defaultName,
    request: {
      method: "GET",
      url: "",
      activeRequestTab: "body",
      activeResponseTab: "body",
      headers: [
        {
          id: generateId("header"),
          key: "",
          value: "",
          enabled: false,
        },
      ],
      params: [
        {
          id: generateId("params"),
          key: "",
          value: "",
          enabled: false,
        },
      ],
      body: "",
      bodyType: "none",
      textSubtype: "raw",
      formSubtype: "urlencoded",
      authType: "inherit",
      credentials: {
        username: "",
        password: "",
        token: "",
        apiKey: "",
        apiKeyName: "X-API-Key",
        apiKeyLocation: "header",
        accessToken: "",
        tokenType: "Bearer",
        authUrl: "",
        tokenUrl: "",
        clientId: "",
        clientSecret: "",
        scope: "",
        state: "",
        realm: "",
        nonce: "",
        qop: "auth",
        nc: "00000001",
        cnonce: "",
        domain: "",
        workstation: "",
        hawkId: "",
        hawkKey: "",
        algorithm: "sha256",
        customKey: "",
        customValue: "",
      },
      timeout: 30000,
    },
    responses: [],
    createdAt: now,
    updatedAt: now,
  };

  return { newRequest, requestId };
};
