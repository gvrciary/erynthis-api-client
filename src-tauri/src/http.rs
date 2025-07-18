use base64::{engine::general_purpose, Engine as _};
use std::collections::HashMap;
use std::time::Duration;
use urlencoding;

use crate::state::{HttpRequest, HttpResponse, HttpError};

pub fn detect_content_type(data: &[u8]) -> &'static str {
    if data.len() < 4 {
        return "application/octet-stream";
    }

    match &data[0..4] {
        [0xFF, 0xD8, 0xFF, _] => "image/jpeg",
        [0x89, 0x50, 0x4E, 0x47] => "image/png",
        [0x47, 0x49, 0x46, 0x38] => "image/gif",
        [0x25, 0x50, 0x44, 0x46] => "application/pdf",
        [0x50, 0x4B, 0x03, 0x04] | [0x50, 0x4B, 0x05, 0x06] | [0x50, 0x4B, 0x07, 0x08] => {
            "application/zip"
        }
        _ => {
            if data
                .iter()
                .all(|&b| b.is_ascii() && (b.is_ascii_graphic() || b.is_ascii_whitespace()))
            {
                "text/plain"
            } else {
                "application/octet-stream"
            }
        }
    }
}

pub async fn execute_http_request(request: HttpRequest) -> Result<HttpResponse, HttpError> {
    let start_time = std::time::Instant::now();

    let client = reqwest::Client::builder()
        .timeout(Duration::from_millis(request.timeout.unwrap_or(30000)))
        .build()
        .map_err(|e| HttpError {
            error: format!("Failed to create HTTP client: {}", e),
            status: None,
        })?;

    let method = request.method.to_uppercase();
    let mut req_builder: reqwest::RequestBuilder = match method.as_str() {
        "GET" => client.get(&request.url),
        "POST" => client.post(&request.url),
        "PUT" => client.put(&request.url),
        "DELETE" => client.delete(&request.url),
        "PATCH" => client.patch(&request.url),
        "HEAD" => client.head(&request.url),
        "OPTIONS" => client.request(reqwest::Method::OPTIONS, &request.url),
        _ => {
            let custom_method =
                reqwest::Method::from_bytes(method.as_bytes()).map_err(|_| HttpError {
                    error: format!("Invalid HTTP method: {}", request.method),
                    status: None,
                })?;
            client.request(custom_method, &request.url)
        }
    };

    for (key, value) in &request.headers {
        req_builder = req_builder.header(key, value);
    }

    match request.body_type.as_deref().unwrap_or("none") {
        "none" => {}
        "text" | "graphql" => {
            if let Some(body) = request.body {
                req_builder = req_builder.body(body);
            }
        }
        "form" => {
            if let Some(body) = request.body {
                match request.form_subtype.as_deref().unwrap_or("urlencoded") {
                    "urlencoded" => {
                        let form_data: Vec<(String, String)> = body
                            .split('&')
                            .filter_map(|pair| {
                                let mut parts = pair.splitn(2, '=');
                                if let (Some(key), Some(value)) = (parts.next(), parts.next()) {
                                    Some((
                                        urlencoding::decode(key).unwrap_or_default().to_string(),
                                        urlencoding::decode(value).unwrap_or_default().to_string(),
                                    ))
                                } else {
                                    None
                                }
                            })
                            .collect();

                        req_builder = req_builder.form(&form_data);
                    }
                    "multipart" => {
                        let mut form = reqwest::multipart::Form::new();

                        for line in body.lines() {
                            if let Some((key, value)) = line.split_once('=') {
                                form = form.text(key.trim().to_string(), value.trim().to_string());
                            }
                        }

                        req_builder = req_builder.multipart(form);
                    }
                    _ => {
                        req_builder = req_builder.body(body);
                    }
                }
            }
        }
        "binary" => {
            if let Some(binary_data) = request.binary_data {
                match general_purpose::STANDARD.decode(&binary_data) {
                    Ok(decoded_data) => {
                        let has_content_type = request
                            .headers
                            .keys()
                            .any(|k| k.to_lowercase() == "content-type");

                        if !has_content_type {
                            let content_type = detect_content_type(&decoded_data);
                            req_builder = req_builder.header("Content-Type", content_type);
                        }

                        req_builder = req_builder.body(decoded_data);
                    }
                    Err(e) => {
                        return Err(HttpError {
                            error: format!("Invalid base64 binary data: {}", e),
                            status: None,
                        });
                    }
                }
            }
        }
        _ => {
            if let Some(body) = request.body {
                req_builder = req_builder.body(body);
            }
        }
    }

    let response = req_builder.send().await.map_err(|e| HttpError {
        error: format!("Request failed: {}", e),
        status: None,
    })?;

    let response_time = start_time.elapsed().as_millis() as u64;
    let status = response.status().as_u16();
    let status_text = response
        .status()
        .canonical_reason()
        .unwrap_or("Unknown")
        .to_string();

    let mut headers = HashMap::new();
    for (key, value) in response.headers() {
        if let Ok(value_str) = value.to_str() {
            headers.insert(key.to_string(), value_str.to_string());
        }
    }

    let body = response.text().await.map_err(|e| HttpError {
        error: format!("Failed to read response body: {}", e),
        status: Some(status),
    })?;

    let body_pretty = if let Ok(json_value) = serde_json::from_str::<serde_json::Value>(&body) {
        serde_json::to_string_pretty(&json_value).unwrap_or_else(|_| body.clone())
    } else {
        body.clone()
    };

    Ok(HttpResponse {
        status,
        status_text,
        headers,
        body,
        body_pretty,
        response_time,
    })
}

pub fn parse_form_data(form_str: &str, form_type: &str) -> Result<Vec<(String, String)>, String> {
    match form_type {
        "urlencoded" => {
            let pairs: Vec<(String, String)> = form_str
                .split('&')
                .filter_map(|pair| {
                    let mut parts = pair.splitn(2, '=');
                    if let (Some(key), Some(value)) = (parts.next(), parts.next()) {
                        Some((
                            urlencoding::decode(key).unwrap_or_default().to_string(),
                            urlencoding::decode(value).unwrap_or_default().to_string(),
                        ))
                    } else {
                        None
                    }
                })
                .collect();
            Ok(pairs)
        }
        "multipart" => {
            let pairs: Vec<(String, String)> = form_str
                .lines()
                .filter_map(|line| {
                    if let Some((key, value)) = line.split_once('=') {
                        Some((key.trim().to_string(), value.trim().to_string()))
                    } else {
                        None
                    }
                })
                .collect();
            Ok(pairs)
        }
        _ => Err("Unsupported form type".to_string()),
    }
} 