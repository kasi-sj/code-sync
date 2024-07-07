import { use, useEffect, useRef, useState } from "react";
import { OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { socket } from "@/socket";
import { useResizable } from "react-resizable-layout";
import SampleSplitter from "./SampleSplitter";
import { Avatar, Card, CardHeader } from "@nextui-org/react";
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

const ClientEditor = ({
  remoteId,
  user,
  path,
}: {
  remoteId: string;
  user: any;
  path: string;
}) => {
  const language = getLanguageFromExtension(path);
  const [fileData, setFileData] = useState("");
  const [cursorPosition, setCursorPosition] = useState({
    lineNumber: 1,
    column: 1,
  });

  const size = useFileStore((state: any) => state.size);
  const [otherCursors, setOtherCursors] = useState([] as any);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [users, setUsers] = useState([] as any);
  useEffect(() => {
    socket.emit("joinFile", `${remoteId.trim()}-${path}`);
    socket.on(
      `${remoteId.trim()}-${(path + "").trim()}-response`,
      (data: any) => {
        console.log(data, "received");
        if (data.initial || data.newUser) {
          setFileData(data.value);
          if (data.cursorPositions[user.id]) {
            setCursorPosition(data.cursorPositions[user.id]);
          }
          if (data.version) {
            client_server_file_versions[`${path}-${user.id}`] = data.version;
          }
          return;
        }
        console.log(data.clientVersions);
        if (
          data.clientVersions[user.id] == undefined ||
          client_file_versions[`${path}-${user.id}`] <=
            data.clientVersions[user.id]
        ) {
          setFileData(data.value);
          setCursorPosition(data.cursorPositions[user.id]);
          setOtherCursors(data.cursorPositions);
          client_server_file_versions[`${path}-${user.id}`] = data.version;
          client_file_versions[`${path}-${user.id}`] =
            data.clientVersions[user.id];
        }
      }
    );
    socket.emit(
      "newUserRequestFileData",
      remoteId.trim(),
      `${remoteId.trim()}-${path}`
    );
    return () => {
      socket.off(`${remoteId.trim()}-${path}-response`);
    };
  }, [remoteId, user, path]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (client_file_versions[`${path}-${user.id}`] == undefined) {
      client_file_versions[`${path}-${user.id}`] = 0;
    }
    if (client_server_file_versions[`${path}-${user.id}`] == undefined) {
      client_server_file_versions[`${path}-${user.id}`] = 0;
    }
    editorRef.current = editor;
  };

  const onChange = (value: string, event: editor.IModelContentChangedEvent) => {
    const editor_ref = editorRef.current;
    if (fileData == value) return;
    console.log(fileData);
    const newEvent = event.changes.map((change) => {
      return {
        rangeOffset: change.rangeOffset,
        rangeLength: change.rangeLength,
        text: change.text,
        clientVersion: ++client_file_versions[`${path}-${user.id}`],
        version: client_server_file_versions[`${path}-${user.id}`],
        cursorPosition: editor_ref?.getPosition(),
        prevText: fileData.substring(
          change.rangeOffset,
          change.rangeOffset + change.rangeLength
        ),
        prevStartLine: fileData.substring(0, change.rangeOffset).split("\n")
          .length,
        prevEndLine: fileData
          .substring(0, change.rangeOffset + change.rangeLength)
          .split("\n").length,
        startLine: value.substring(0, change.rangeOffset).split("\n").length,
        endLine: value
          .substring(0, change.rangeOffset + change.text.length)
          .split("\n").length,
      };
    });
    setFileData(value);
    socket.emit(`clientChange`, {
      path: `${remoteId.trim()}-${path}`,
      remoteId: remoteId,
      event: newEvent,
      user: user,
      value: value,
    });
  };

  useEffect(() => {
    const updateCursor = async () => {
      const editor_ref = editorRef.current;
      if (editor_ref == null) return;
      if (cursorPosition == null) return;
      editor_ref.setPosition(cursorPosition);
      const cursor: any = [];
      const newUsers = [];
      for (let key in otherCursors) {
        if (otherCursors[key].user) {
          newUsers.push(otherCursors[key].user);
        }
        if (key == user.id) continue;
        const { lineNumber, column, user: clientUser } = otherCursors[key];
        const Range = (await import("monaco-editor")).Range;
        const local_editor = (await import("monaco-editor")).editor;
        cursor.push({
          range: new Range(lineNumber, column, lineNumber, column),
          options: {
            className: "custom-cursor",
            stickiness:
              local_editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            hoverMessage: { value: clientUser.name || key },
          },
        });
      }
      setUsers(newUsers);
      editor_ref.createDecorationsCollection(cursor);
    };
    updateCursor();
  }, [cursorPosition]);

  const { isDragging, position, splitterProps } = useResizable({
    axis: "x",
    initial: 200,
    min: 50,
    reverse: true,
  });

  return (
    <div className="bg-black flex flex-row h-full w-full  font-mono overflow-hidden">
      <div className="flex flex-grow h-full w-full">
        <div className="flex flex-grow w-full h-full">
          <Editor
            height="100%"
            language={language}
            value={fileData}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            onChange={(value, ev) => {
              onChange(value || "", ev);
            }}
            className={` ${getSize(
              size
            )} focus:outline-none border-none -ml-1 `}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              automaticLayout: true,
              fontSize: (size + 2) * 5,
            }}
          />
        </div>
        <SampleSplitter
          dir="vertical"
          isDragging={isDragging}
          {...splitterProps}
          className="bg-zinc-600  cursor-col-resize w-1  hover:w-[6px] hover:bg-blue-600 h-full"
        />
        <div
          className={
            "flex-shrink-0 bg-[rgb(23,23,23)] grid w-full pt-1 overflow-scroll scrollbar-hide h-full place-items-center transition filter ease-out duration-200 "
          }
          style={{ width: position }}
        >
          <div className=" flex w-full h-full flex-col justify-start gap-1">
            <h2 className="text-white h-5 m-2">Participants</h2>
            {users.map((user: any) => {
              if (user)
                return (
                  <div key={user} className="w-full p-1">
                    <Card className="w-full bg-[rgb(10,11,10)] text-gray-300 ">
                      <CardHeader className="justify-between w-full">
                        <div className="flex w-full gap-5">
                          <Avatar
                            isBordered
                            radius="full"
                            size="md"
                            name={user.name}
                          />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4
                              className={`${getSize(
                                size
                              )} font-semibold leading-none text-default-600`}
                            >
                              {user.name}
                            </h4>
                            <h5
                              className={`${getSize(
                                size
                              )} tracking-tight text-default-400`}
                            >
                              {user.email}
                            </h5>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                );
              else return <div key={user}></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEditor;
