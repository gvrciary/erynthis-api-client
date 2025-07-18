import type { CodeTemplate } from "../types/data";
import type { HttpRequest } from "../types/http";

const escapeShell = (str: string): string => {
  return str.replace(/'/g, "'\"'\"'");
};

const escapeJson = (str: string): string => {
  return JSON.stringify(str).slice(1, -1);
};

const buildHeaders = (request: HttpRequest): Record<string, string> => {
  const headers: Record<string, string> = {};

  request.headers.forEach((header) => {
    if (header.enabled && header.key.trim() && header.value.trim()) {
      headers[header.key] = header.value;
    }
  });

  if (request.body && request.bodyType !== "none" && !headers["Content-Type"]) {
    switch (request.bodyType) {
      case "text":
        if (request.textSubtype === "json") {
          headers["Content-Type"] = "application/json";
        } else if (request.textSubtype === "xml") {
          headers["Content-Type"] = "application/xml";
        } else {
          headers["Content-Type"] = "text/plain";
        }
        break;
      case "form":
        if (request.formSubtype === "urlencoded") {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        } else {
          headers["Content-Type"] = "multipart/form-data";
        }
        break;
    }
  }

  return headers;
};

export const codeTemplates: CodeTemplate[] = [
  {
    id: "curl",
    name: "Shell - cURL",
    language: "shell",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'echo "NO URL AVAILABLE"';
      }

      const headers = buildHeaders(request);
      let curl = `curl --request ${request.method} \\\n  --url '${request.url}'`;

      Object.entries(headers).forEach(([key, value]) => {
        curl += ` \\\n  --header '${key}: ${escapeShell(value)}'`;
      });

      if (request.body && request.bodyType !== "none") {
        curl += ` \\\n  --data '${escapeShell(request.body)}'`;
      }

      return curl;
    },
  },
  {
    id: "go",
    name: "Go",
    language: "go",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'fmt.Println("NO URL AVAILABLE")';
      }

      const headers = buildHeaders(request);
      let code = `package main

import (
    "fmt"
    "net/http"
    "strings"
)

func main() {
`;

      if (request.body && request.bodyType !== "none") {
        code += `    payload := strings.NewReader(\`${request.body}\`)
    req, _ := http.NewRequest("${request.method}", "${request.url}", payload)
`;
      } else {
        code += `    req, _ := http.NewRequest("${request.method}", "${request.url}", nil)
`;
      }

      Object.entries(headers).forEach(([key, value]) => {
        code += `    req.Header.Add("${key}", "${escapeJson(value)}")
`;
      });

      code += `
    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()

    fmt.Println("Status:", res.Status)
}`;

      return code;
    },
  },
  {
    id: "python",
    name: "Python - Requests",
    language: "python",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'print("NO URL AVAILABLE")';
      }

      const headers = buildHeaders(request);
      let code = `import requests

url = "${request.url}"
`;

      if (Object.keys(headers).length > 0) {
        code += `headers = ${JSON.stringify(headers, null, 2)}
`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `data = """${request.body}"""
`;
      }

      code += `
response = requests.${request.method.toLowerCase()}(url`;

      if (Object.keys(headers).length > 0) {
        code += `, headers=headers`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `, data=data`;
      }

      code += `)

print("Status Code:", response.status_code)
print("Response:", response.text)`;

      return code;
    },
  },
  {
    id: "java",
    name: "Java",
    language: "java",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'System.out.println("NO URL AVAILABLE");';
      }

      const headers = buildHeaders(request);
      let code = `import java.net.http.*;
import java.net.URI;

public class HttpRequest {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

`;

      if (request.body && request.bodyType !== "none") {
        code += `        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create("${request.url}"))
            .method("${request.method}", HttpRequest.BodyPublishers.ofString("${escapeJson(request.body)}"));
`;
      } else {
        code += `        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create("${request.url}"))
            .method("${request.method}", HttpRequest.BodyPublishers.noBody());
`;
      }

      Object.entries(headers).forEach(([key, value]) => {
        code += `        requestBuilder.header("${key}", "${escapeJson(value)}");
`;
      });

      code += `
        HttpRequest request = requestBuilder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Status: " + response.statusCode());
        System.out.println("Response: " + response.body());
    }
}`;

      return code;
    },
  },
  {
    id: "cpp",
    name: "C++",
    language: "cpp",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'std::cout << "NO URL AVAILABLE" << std::endl;';
      }

      const headers = buildHeaders(request);
      let code = `#include <iostream>
#include <curl/curl.h>

int main() {
    CURL *curl;
    CURLcode res;

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "${request.url}");
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${request.method}");
`;

      if (request.body && request.bodyType !== "none") {
        code += `        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, R"(${request.body})");
`;
      }

      if (Object.keys(headers).length > 0) {
        code += `
        struct curl_slist *headers = NULL;
`;
        Object.entries(headers).forEach(([key, value]) => {
          code += `        headers = curl_slist_append(headers, "${key}: ${escapeJson(value)}");
`;
        });
        code += `        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
`;
      }

      code += `
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
    return 0;
}`;

      return code;
    },
  },
  {
    id: "csharp",
    name: "C#",
    language: "csharp",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'Console.WriteLine("NO URL AVAILABLE");';
      }

      const headers = buildHeaders(request);
      let code = `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        using var client = new HttpClient();

`;

      Object.entries(headers).forEach(([key, value]) => {
        code += `        client.DefaultRequestHeaders.Add("${key}", "${escapeJson(value)}");
`;
      });

      if (request.body && request.bodyType !== "none") {
        code += `        var content = new StringContent("${escapeJson(request.body)}", Encoding.UTF8, "application/json");
        var response = await client.${request.method.charAt(0) + request.method.slice(1).toLowerCase()}Async("${request.url}", content);
`;
      } else {
        code += `        var response = await client.${request.method.charAt(0) + request.method.slice(1).toLowerCase()}Async("${request.url}");
`;
      }

      code += `
        Console.WriteLine($"Status: {response.StatusCode}");
        Console.WriteLine($"Response: {await response.Content.ReadAsStringAsync()}");
    }
}`;

      return code;
    },
  },
  {
    id: "kotlin",
    name: "Kotlin",
    language: "kotlin",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'println("NO URL AVAILABLE")';
      }

      const headers = buildHeaders(request);
      let code = `import okhttp3.*
import java.io.IOException

fun main() {
    val client = OkHttpClient()

`;

      if (request.body && request.bodyType !== "none") {
        code += `    val mediaType = MediaType.parse("application/json")
    val body = RequestBody.create(mediaType, """${request.body}""")

    val request = Request.Builder()
        .url("${request.url}")
        .method("${request.method}", body)
`;
      } else {
        code += `    val request = Request.Builder()
        .url("${request.url}")
        .method("${request.method}", null)
`;
      }

      Object.entries(headers).forEach(([key, value]) => {
        code += `        .addHeader("${key}", "${escapeJson(value)}")
`;
      });

      code += `        .build()

    client.newCall(request).execute().use { response ->
        println("Status: \${response.code()}")
        println("Response: \${response.body()?.string()}")
    }
}`;

      return code;
    },
  },
  {
    id: "php",
    name: "PHP",
    language: "php",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'echo "NO URL AVAILABLE";';
      }

      const headers = buildHeaders(request);
      let code = `<?php

$url = "${request.url}";
$method = "${request.method}";
`;

      if (Object.keys(headers).length > 0) {
        code += `$headers = [
${Object.entries(headers)
  .map(([key, value]) => `    "${key}: ${escapeJson(value)}"`)
  .join(",\n")}
];
`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `$data = '${escapeJson(request.body)}';
`;
      }

      code += `
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
`;

      if (Object.keys(headers).length > 0) {
        code += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
`;
      }

      code += `
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $httpCode . "\\n";
echo "Response: " . $response . "\\n";
?>`;

      return code;
    },
  },
  {
    id: "r",
    name: "R",
    language: "r",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'print("NO URL AVAILABLE")';
      }

      const headers = buildHeaders(request);
      let code = `library(httr)

url <- "${request.url}"
`;

      if (Object.keys(headers).length > 0) {
        code += `headers <- c(
${Object.entries(headers)
  .map(([key, value]) => `  "${key}" = "${escapeJson(value)}"`)
  .join(",\n")}
)
`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `body <- '${escapeJson(request.body)}'
`;
      }

      code += `
response <- ${request.method.toUpperCase()}(url`;

      if (Object.keys(headers).length > 0) {
        code += `, add_headers(.headers = headers)`;
      }

      if (request.body && request.bodyType !== "none") {
        code += `, body = body`;
      }

      code += `)

cat("Status:", status_code(response), "\\n")
cat("Response:", content(response, "text"), "\\n")`;

      return code;
    },
  },
  {
    id: "ruby",
    name: "Ruby",
    language: "ruby",
    generate: (request: HttpRequest) => {
      if (!request.url.trim()) {
        return 'puts "NO URL AVAILABLE"';
      }

      const headers = buildHeaders(request);
      let code = `require 'net/http'
require 'uri'

uri = URI('${request.url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

request = Net::HTTP::${request.method.charAt(0) + request.method.slice(1).toLowerCase()}.new(uri)
`;

      Object.entries(headers).forEach(([key, value]) => {
        code += `request['${key}'] = '${escapeJson(value)}'
`;
      });

      if (request.body && request.bodyType !== "none") {
        code += `request.body = '${escapeJson(request.body)}'
`;
      }

      code += `
response = http.request(request)

puts "Status: #{response.code}"
puts "Response: #{response.body}"`;

      return code;
    },
  },
];

export const getCodeTemplate = (
  templateId: string,
): CodeTemplate | undefined => {
  return codeTemplates.find((template) => template.id === templateId);
};
