use async_process::{Command, Stdio};
use async_std::io::WriteExt;
use futures_lite::io::{AsyncBufReadExt, BufReader};
use futures_lite::stream::StreamExt;
use serde::Serialize;
use serde_json::error;
use std::collections::VecDeque;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::{async_runtime::spawn, State, Window};

#[derive(Serialize, Clone)]
struct TerminalOutput {
    output: String,
    stderr: bool,
}

struct SharedState {
    command_queue: Mutex<VecDeque<String>>,
}

use tauri::AppHandle;
#[tauri::command]
fn close_app(handle: AppHandle) {
    handle.exit(0);
}


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    let path_buf = PathBuf::from(path);
    fs::read_to_string(&path_buf).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(path: String, contents: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    fs::write(&path_buf, contents).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    fs::remove_file(&path_buf).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String, name: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path).join(name);
    fs::File::create(&path_buf).map(|_| ()).map_err(|e| e.to_string())
}

#[tauri::command]
async fn start_terminal(
    window: Window,
    state: State<'_, Arc<SharedState>>,
    directory: String,
) -> Result<u32, String> {
    println!("Starting terminal in directory: {}", directory);

    let mut command = Command::new("cmd.exe")
        .args(&["/K", "cd", &directory]) // Set the initial directory
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    println!("Command spawned successfully.");

    let mut stdin = command.stdin.take().ok_or("Failed to open stdin")?;
    let stdout = command.stdout.take().ok_or("Failed to open stdout")?;
    let stderr = command.stderr.take().ok_or("Failed to open stderr")?;
    let reader = BufReader::new(stdout);
    let error_reader = BufReader::new(stderr);
    let id = command.id();
    let state = Arc::clone(&state) as Arc<SharedState>; // Clone only what's needed and ensure 'static lifetime
    let new_window = window.clone();

    spawn(async move {
        let mut lines = reader.lines();

        while let Some(line) = lines.next().await {
            match line {
                Ok(output) => {
                    println!("Read line: {}", output);
                    let terminal_output = TerminalOutput {
                        output,
                        stderr: false,
                    };
                    window.emit("terminal-output", terminal_output).unwrap();
                }
                Err(err) => {
                    println!("Error reading line: {}", err);
                }
            }
        }
    });

    spawn(async move {
        let mut lines = error_reader.lines();

        while let Some(line) = lines.next().await {
            match line {
                Ok(output) => {
                    println!("Read error line: {}", output);
                    let terminal_output = TerminalOutput {
                        output,
                        stderr: true,
                    };
                    new_window.emit("terminal-output", terminal_output).unwrap();
                }
                Err(err) => {
                    println!("Error reading error line: {}", err);
                }
            }
        }
    });

    let state = state.clone(); // Clone only what's needed

    spawn(async move {
        loop {
            let cmd = {
                let mut queue = state.command_queue.lock().unwrap();
                queue.pop_front()
            };
            if let Some(cmd) = cmd {
                if let Err(e) = stdin.write_all(format!("{}\n", cmd).as_bytes()).await {
                    eprintln!("Failed to write to stdin: {}", e);
                }
            }
            std::thread::sleep(std::time::Duration::from_millis(100));
        }
    });
    // return the id of the command
    Ok(id)
}

#[tauri::command]
fn execute_command(command: String, state: State<'_, Arc<SharedState>>) -> Result<(), String> {
    let mut queue = state.command_queue.lock().unwrap();
    queue.push_back(command);
    Ok(())
}
#[tauri::command]
fn create_folder(path: String, name: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path).join(name);
    fs::create_dir(&path_buf).map(|_| ()).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_folder_recursive(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    fs::remove_dir_all(&path_buf).map_err(|e| e.to_string())
}

#[tauri::command]
fn rename_file(path: String, new_name: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    let new_path_buf = path_buf.with_file_name(new_name);
    fs::rename(&path_buf, &new_path_buf).map_err(|e| e.to_string())
}

#[tauri::command]
fn rename_folder(path: String, new_name: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);
    let new_path_buf = path_buf.with_file_name(new_name);
    fs::rename(&path_buf, &new_path_buf).map_err(|e| e.to_string())
}


fn main() {
    tauri::Builder::default()
        .manage(Arc::new(SharedState {
            command_queue: Mutex::new(VecDeque::new()),
        }))
        .invoke_handler(tauri::generate_handler![
            start_terminal,
            execute_command,
            greet,
            read_file,
            write_file,
            delete_file,
            create_file,
            create_folder,
            delete_folder_recursive,
            rename_file,
            rename_folder,
            close_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
