import { use, useEffect, useRef, useState } from "react";
import { OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { socket } from "@/socket";
import { invoke } from "@tauri-apps/api/tauri";
import { useFileStore } from "@/store";
import { getSize } from "@/utills";

var client_file_versions: { [key: string]: any } = {};
var client_server_file_versions: { [key: string]: any } = {};

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split(".").pop();
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "py":
      return "python";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "jsx":
      return "javascript";
    case "tsx":
      return "typescript";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    case "sql":
      return "sql";
    case "swift":
      return "swift";
    case "kt":
      return "kotlin";
    case "md":
      return "markdown";
    case "yaml":
      return "yaml";
    default:
      return "plaintext";
  }
};

const HomeEditor = ({
  path,
}: {
  path: string;
}) => {
  const language = getLanguageFromExtension(path);
  const [fileData, setFileData] = useState("");
  const size = useFileStore((state:any) => state.size);
  const initializeFile = async ()=>{
    const data = await invoke("read_file", { path: path });
    setFileData(data as string||"");
  }
  useEffect(()=>{
    initializeFile();
  },[path])

  const onChange = (value: string, event: editor.IModelContentChangedEvent) => {
    invoke("write_file" , {path:path , contents:value});
  };

  return (
    <div className="h-full ">
      <Editor
        height="100%"
        language={language}
        value={fileData}
        theme="vs-dark"
        onChange={(value, ev) => {
          onChange(value || "", ev);
        }}
        className={`-mt-3 focus:outline-none border-none -ml-1 ${getSize(size+1)} `}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          fontSize : (size+2)*5
          
        }}
      />
    </div>
  );
};

export default HomeEditor;
