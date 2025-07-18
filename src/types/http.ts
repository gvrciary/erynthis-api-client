export interface HttpHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface HttpParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
  token: string;
  apiKey: string;
  apiKeyName: string;
  apiKeyLocation: string;
  accessToken: string;
  tokenType: string;
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  state: string;
  realm: string;
  nonce: string;
  qop: string;
  nc: string;
  cnonce: string;
  domain: string;
  workstation: string;
  hawkId: string;
  hawkKey: string;
  algorithm: string;
  customKey: string;
  customValue: string;
}

export interface HttpRequest {
  method: string;
  url: string;
  activeRequestTab: string;
  activeResponseTab: string;
  headers: HttpHeader[];
  params: HttpParam[];
  authType: string;
  credentials: AuthCredentials;
  body: string;
  bodyType: "none" | "text" | "form" | "binary" | "graphql";
  textSubtype: "raw" | "json" | "xml" | "yaml";
  formSubtype: "urlencoded" | "multipart";
  binaryFile?: File | null;
  timeout: number;
}

export interface HttpResponse {
  status: number;
  status_text: string;
  headers: Record<string, string>;
  body: string;
  body_pretty: string;
  response_time: number;
}

export interface HttpError {
  error: string;
  status?: number;
}
