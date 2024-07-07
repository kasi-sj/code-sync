import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
  readDir,
} from "@tauri-apps/api/fs";

const DATA_FILE_PATH = "data.json"; // File name in the AppData directory
const APP_DATA_DIR = BaseDirectory.AppData;

interface DataObject {
  [key: string]: any;
}

async function saveData(key: string, value: any): Promise<void> {
  let currentData: DataObject = {};
  try {
    const data = await readTextFile(DATA_FILE_PATH, { dir: APP_DATA_DIR });
    currentData = JSON.parse(data) as DataObject;
  } catch (error) {
    await writeTextFile(DATA_FILE_PATH, "{}", { dir: APP_DATA_DIR });
    currentData = {};
    console.log("No existing data file found, creating new file.");
  }

  currentData[key] = value;
  try {
    await writeTextFile(DATA_FILE_PATH, JSON.stringify(currentData), {
      dir: APP_DATA_DIR,
    });
  } catch (e) {
    console.error("Failed to write data:", e);
  }
}

async function loadData(key: string): Promise<any | null> {
  try {
    console.log(APP_DATA_DIR);
    const data = await readTextFile(DATA_FILE_PATH, { dir: APP_DATA_DIR });
    const parsedData = JSON.parse(data);
    return parsedData[key];
  } catch (error) {
    try {
      await writeTextFile(DATA_FILE_PATH, "{}", { dir: APP_DATA_DIR });
      return "seems";
    } catch (e) {
      console.error("Failed to create data:", e);
      return "CANNOT CREATE AN FILE " + e;
    }
  }
}

async function removeData(key: string): Promise<void> {
  let currentData: DataObject = {};
  try {
    const data = await readTextFile(DATA_FILE_PATH, { dir: APP_DATA_DIR });
    currentData = JSON.parse(data) as DataObject;
  } catch (error) {
    await writeTextFile(DATA_FILE_PATH, "{}", { dir: APP_DATA_DIR });
    currentData = {};
    console.log("No existing data file found, creating new file.");
  }

  if (key in currentData) {
    delete currentData[key];
    try {
      await writeTextFile(DATA_FILE_PATH, JSON.stringify(currentData), {
        dir: APP_DATA_DIR,
      });
    } catch (e) {
      console.error("Failed to write data:", e);
    }
  } else {
    console.log("Key not found in data.");
  }
}

async function read(path: string): Promise<string> {
  try {
    const data = await readTextFile(path);
    return data;
  } catch (error) {
    console.error("Failed to read file:", error);
    throw error; // Rethrow the error after logging it
  }
}

async function write(path: string, content: string): Promise<void> {
  try {
    await writeTextFile(path, content);
  } catch (error) {
    console.error("Failed to read file:", error);
    throw error; // Rethrow the error after logging it
  }
}

async function isDirectory(path: string) {
  try {
    const entries = await readDir(path);
    // If readDir succeeds, the path is a directory
    return true;
  } catch (error) {
    // If readDir fails, the path is not a directory (or it doesn't exist)
    return false;
  }
}

async function readDirectory(path: string) {
  try {
    const entries = await readDir(path, { recursive: true });
    return entries;
  } catch (error) {
    throw error;
  }
}

function getSize(index: number) {
  const size = [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7xl",
  ];
  return size[index];
}

export {
  getSize,
  saveData,
  loadData,
  removeData,
  read,
  write,
  isDirectory,
  readDirectory,
};
