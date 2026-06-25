#[tauri::command]
fn greet(name: &str) -> String {
    format!(
        "Hello, {}! Dong nay duoc build tren CI macOS va chay tren iPhone qua SideStore.",
        name
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
