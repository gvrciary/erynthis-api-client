use tauri::command;

use crate::state::{HttpRequest, HttpResponse, HttpError};
use crate::http::{execute_http_request, parse_form_data};

#[command]
pub async fn make_http_request(request: HttpRequest) -> Result<HttpResponse, HttpError> {
    execute_http_request(request).await
}

#[command]
pub fn parse_form_data_command(form_str: &str, form_type: &str) -> Result<Vec<(String, String)>, String> {
    parse_form_data(form_str, form_type)
} 