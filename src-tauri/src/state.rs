use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: HashMap<String, String>,
    pub body: Option<String>,
    pub body_type: Option<String>,
    pub text_subtype: Option<String>,
    pub form_subtype: Option<String>,
    pub binary_data: Option<String>,
    pub timeout: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HttpResponse {
    pub status: u16,
    pub status_text: String,
    pub headers: HashMap<String, String>,
    pub body: String,
    pub body_pretty: String,
    pub response_time: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HttpError {
    pub error: String,
    pub status: Option<u16>,
} 