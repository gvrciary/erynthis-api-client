import { invoke } from "@tauri-apps/api/core";
import type { HttpRequest, HttpResponse } from "../types/http";
import { resolveVariables } from "../utils/variables";

export const sendHttpRequest = async (
  request: HttpRequest,
): Promise<HttpResponse> => {
  const resolvedUrl = resolveVariables(request.url);

  const headersMap: Record<string, string> = {};
  request.headers
    .filter((header) => header.enabled && header.key.trim())
    .forEach((header) => {
      const resolvedKey = resolveVariables(header.key);
      const resolvedValue = resolveVariables(header.value);
      headersMap[resolvedKey] = resolvedValue;
    });

  const resolvedBody = request.body ? resolveVariables(request.body) : null;

  const requestData = {
    method: request.method,
    url: resolvedUrl,
    headers: headersMap,
    body: resolvedBody,
    body_type: request.bodyType,
    text_subtype: request.textSubtype,
    form_subtype: request.formSubtype,
    binary_data: request.binaryFile ? resolvedBody : null,
    timeout: request.timeout,
  };

  return await invoke<HttpResponse>("make_http_request", {
    request: requestData,
  });
};
