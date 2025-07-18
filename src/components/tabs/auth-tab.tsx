import { Link as LinkIcon, Settings, Shield } from "lucide-react";
import { memo, useMemo } from "react";
import Dropdown from "@/components/ui/drop-down";
import EmptyState from "@/components/ui/empty-state";
import { AUTH_TYPES, LOCATION_OPTIONS, TOKEN_TYPE_OPTIONS } from "@/constants";
import { useHttpAuth } from "@/hooks/http/useHttpAuth";
import type { AuthCredentials } from "@/types/http";

interface AuthTabProps {
  className?: string;
}

interface FormProps {
  credentials: AuthCredentials;
  onCredentialChange: (field: string, value: string) => void;
}

const InputField = memo<{
  label: string;
  value: string;
  field: string;
  placeholder: string;
  type?: string;
  rows?: number;
  onChange: (field: string, value: string) => void;
}>(
  ({ label, value, field, placeholder, type = "text", rows = 1, onChange }) => {
    const inputId = `input-${field}`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
        {rows > 1 ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-border rounded-md text-sm text-foreground placeholder-muted-foreground bg-background focus-ring resize-none"
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-border rounded-md text-sm text-foreground placeholder-muted-foreground bg-background focus-ring"
          />
        )}
      </div>
    );
  },
);

const BasicAuthForm = memo<{
  credentials: AuthCredentials;
  onCredentialChange: (field: string, value: string) => void;
}>(({ credentials, onCredentialChange }) => (
  <div className="space-y-4">
    <InputField
      label="Username"
      value={credentials.username}
      field="username"
      placeholder="Enter username"
      onChange={onCredentialChange}
    />
    <InputField
      label="Password"
      value={credentials.password}
      field="password"
      placeholder="Enter password"
      type="password"
      onChange={onCredentialChange}
    />
  </div>
));

const BearerAuthForm = memo(
  ({ credentials, onCredentialChange }: FormProps) => {
    const tokenTypeId = "tokenType-dropdown";

    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor={tokenTypeId}
            className="block text-sm font-medium text-foreground mb-1"
          >
            Token Type
          </label>
          <Dropdown
            options={TOKEN_TYPE_OPTIONS}
            value={credentials.tokenType}
            onChange={(value) => onCredentialChange("tokenType", value)}
            className="w-full"
            showCheck={false}
          />
        </div>
        <InputField
          label="Token"
          value={credentials.token}
          field="token"
          placeholder="Enter your token"
          rows={3}
          onChange={onCredentialChange}
        />
      </div>
    );
  },
);

const ApiKeyAuthForm = memo(
  ({ credentials, onCredentialChange }: FormProps) => {
    const locationId = "apiKeyLocation-dropdown";

    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor={locationId}
            className="block text-sm font-medium text-foreground mb-1"
          >
            Key Location
          </label>
          <Dropdown
            options={LOCATION_OPTIONS}
            value={credentials.apiKeyLocation}
            onChange={(value) => onCredentialChange("apiKeyLocation", value)}
            className="w-full"
            showCheck={false}
          />
        </div>
        <InputField
          label="Key Name"
          value={credentials.apiKeyName}
          field="apiKeyName"
          placeholder="X-API-Key"
          onChange={onCredentialChange}
        />
        <InputField
          label="Key Value"
          value={credentials.apiKey}
          field="apiKey"
          placeholder="Enter your API key"
          onChange={onCredentialChange}
        />
      </div>
    );
  },
);

const OAuth2AuthForm = memo(
  ({ credentials, onCredentialChange }: FormProps) => (
    <div className="space-y-4">
      <InputField
        label="Access Token"
        value={credentials.accessToken}
        field="accessToken"
        placeholder="Enter access token"
        rows={2}
        onChange={onCredentialChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Token Type"
          value={credentials.tokenType}
          field="tokenType"
          placeholder="Bearer"
          onChange={onCredentialChange}
        />
        <InputField
          label="Scope"
          value={credentials.scope}
          field="scope"
          placeholder="read write"
          onChange={onCredentialChange}
        />
      </div>
      <InputField
        label="Authorization URL"
        value={credentials.authUrl}
        field="authUrl"
        placeholder="https://example.com/oauth/authorize"
        type="url"
        onChange={onCredentialChange}
      />
      <InputField
        label="Token URL"
        value={credentials.tokenUrl}
        field="tokenUrl"
        placeholder="https://example.com/oauth/token"
        type="url"
        onChange={onCredentialChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Client ID"
          value={credentials.clientId}
          field="clientId"
          placeholder="Client ID"
          onChange={onCredentialChange}
        />
        <InputField
          label="Client Secret"
          value={credentials.clientSecret}
          field="clientSecret"
          placeholder="Client Secret"
          type="password"
          onChange={onCredentialChange}
        />
      </div>
    </div>
  ),
);

const CustomAuthForm = memo(
  ({ credentials, onCredentialChange }: FormProps) => (
    <div className="space-y-4">
      <InputField
        label="Header Name"
        value={credentials.customKey}
        field="customKey"
        placeholder="Custom header name"
        onChange={onCredentialChange}
      />
      <InputField
        label="Header Value"
        value={credentials.customValue}
        field="customValue"
        placeholder="Custom header value"
        rows={3}
        onChange={onCredentialChange}
      />
    </div>
  ),
);

const AuthTab = memo(({ className }: AuthTabProps) => {
  const { getSelectedRequest, handleAuthTypeChange, handleCredentialChange } =
    useHttpAuth();

  const requestItem = getSelectedRequest();

  const authForm = useMemo(() => {
    if (!requestItem) return null;

    const { credentials } = requestItem.request;

    if (!credentials) {
      return (
        <EmptyState
          icon={Settings}
          title="Loading authentication settings..."
        />
      );
    }

    switch (requestItem.request.authType) {
      case "none":
        return <EmptyState icon={Shield} title="No authentication required" />;

      case "inherit":
        return (
          <EmptyState
            icon={LinkIcon}
            title="Inherit authentication from parent collection"
            subtitle="This request will use the parent's auth settings"
          />
        );

      case "basic":
        return (
          <BasicAuthForm
            credentials={credentials}
            onCredentialChange={handleCredentialChange}
          />
        );

      case "bearer":
        return (
          <BearerAuthForm
            credentials={credentials}
            onCredentialChange={handleCredentialChange}
          />
        );

      case "apikey":
        return (
          <ApiKeyAuthForm
            credentials={credentials}
            onCredentialChange={handleCredentialChange}
          />
        );

      case "oauth2":
        return (
          <OAuth2AuthForm
            credentials={credentials}
            onCredentialChange={handleCredentialChange}
          />
        );

      case "custom":
        return (
          <CustomAuthForm
            credentials={credentials}
            onCredentialChange={handleCredentialChange}
          />
        );

      default:
        return (
          <EmptyState icon={Settings} title="Select an authentication type" />
        );
    }
  }, [requestItem, handleCredentialChange]);

  if (!requestItem) return null;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-border flex-shrink-0 relative z-20">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Authentication
        </h3>

        <Dropdown
          options={AUTH_TYPES}
          value={requestItem.request.authType}
          onChange={handleAuthTypeChange}
          placeholder="Select auth type"
          className="w-full"
          optionsClassName="z-[60]"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full p-4 overflow-y-auto">{authForm}</div>
      </div>
    </div>
  );
});

export default AuthTab;
