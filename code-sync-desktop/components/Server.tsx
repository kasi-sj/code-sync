import { socket } from "@/socket";
import { useFileStore } from "@/store";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

interface ClientVersion {
  [key: string]: number;
}

interface CursorPosition {
  [key: string]: { lineNumber: number; column: number; user?:any };
}

interface Operation {
  rangeOffset: number;
  rangeLength: number;
  text: string;
  clientVersion: number;
  version: number;
  cursorPosition: { lineNumber: number; column: number };
  [key: string]: any;
  prevText: string;
  prevStartLine: number;
  prevEndLine: number;
  startLine: number;
  endLine: number;
}

const server_file_datas: { [key: string]: string } = {};
const server_file_versions: { [key: string]: number } = {};
const server_file_clientVersions: { [key: string]: ClientVersion } = {};
const server_file_cursorPositions: { [key: string]: CursorPosition } = {};
const server_file_operations: { [key: string]: Operation[] } = {};

const setFileData = (path: string, data: string) => {
  server_file_datas[path] = data;
};

const hasFileData = (path: string) => {
  return server_file_datas[path] !== undefined;
};

const getFileData = (path: string) => {
  return server_file_datas[path];
};

const setVersion = (path: string, version: number) => {
  server_file_versions[path] = version;
};

const getVersion = (path: string) => {
  return server_file_versions[path];
};

const setClientVersion = (
  path: string,
  clientId: string,
  clientVersion: number
) => {
  server_file_clientVersions[path] = {
    ...server_file_clientVersions[path],
    [clientId]: clientVersion,
  };
};

const getClientVersion = (path: string, clientId: string) => {
  return server_file_clientVersions[path][clientId];
};

const setClientCursor = (
  path: string,
  clientId: string,
  cursor: { lineNumber: number; column: number }
) => {
  server_file_cursorPositions[path] = {
    ...server_file_cursorPositions[path],
    [clientId]: cursor,
  };
};

const getClientCursor = (path: string, clientId: string) => {
  return server_file_cursorPositions[path][clientId];
};

// a is new
// Transform operation a against operation b, including cursor state
const transformOperation = (a: Operation, b: Operation): Operation => {
  if (a.rangeOffset >= b.rangeOffset + b.rangeLength) {
    const lineChange =
      b.text.split("\n").length - b.prevText.split("\n").length;
    var columnChange = 0;
    if (b.prevEndLine == a.prevStartLine) {
      columnChange =
        (a.text.split("\n").pop() || "")?.length -
        (b.prevText.split("\n").pop() || "")?.length;
    }
    return {
      ...a,
      rangeOffset: a.rangeOffset + b.text.length - b.rangeLength,
      cursorPosition: {
        lineNumber: a.cursorPosition.lineNumber + lineChange,
        column: a.cursorPosition.column + columnChange,
      },
    };
  } else if (a.rangeOffset + a.rangeLength <= b.rangeOffset) {
    // a ends before b
    return a;
  } else {
    throw new Error("Operation can't be transformed");
  }
};

const applyOperation = (oldString: string, operation: Operation): string => {
  const beforeChange = oldString.slice(0, operation.rangeOffset);
  const afterChange = oldString.slice(
    operation.rangeOffset + operation.rangeLength
  );
  const newString = beforeChange + operation.text + afterChange;
  return newString;
};

const transform = (
  operation: Operation,
  prev: string,
  path: string,
  user: any
) => {
  const operations = server_file_operations[path];
  setClientVersion(path, user.id, operation.clientVersion);
  for (let i = 0; i < operations.length; i++) {
    if (operations[i].version > operation.version) {
      try {
        operation = transformOperation(operation, operations[i]);
      } catch (e) {
        setClientCursor(path, user.id, { column: 1, lineNumber: 1 });
        return prev;
      }
    }
  }
  operations.push(operation);
  setClientCursor(path, user.id, operation.cursorPosition);
  const cursors = server_file_cursorPositions[path];
  const lineChange =
    operation.text.split("\n").length - operation.prevText.split("\n").length;
  const columnChange =
    (operation.text.split("\n").pop() || "")?.length -
    (operation.prevText.split("\n").pop() + "")?.length;
  for (const key in cursors) {
    if (key != user.id) {
      const cursor = cursors[key];
      if (cursor.lineNumber < operation.prevStartLine) {
        // no problem
      } else if (cursor.lineNumber > operation.prevEndLine) {
        cursors[key] = {
          lineNumber: cursors[key].lineNumber + lineChange,
          column: cursors[key].column,
        };
      } else if (cursor.lineNumber == operation.prevEndLine) {
        if (
          cursor.column < (operation.prevText.split("\n").pop() || "")?.length
        ) {
          cursors[key] = {
            lineNumber: cursors[key].lineNumber + lineChange,
            column: operation.cursorPosition.column,
          };
        } else {
          cursors[key] = {
            lineNumber: cursors[key].lineNumber + lineChange,
            column: cursors[key].column + columnChange,
          };
        }
      } else if (cursor.lineNumber == operation.prevStartLine) {
        if (cursor.column <= operation.rangeOffset) {
          // no problem
        } else if (cursor.column > operation.rangeOffset) {
          cursors[key] = {
            lineNumber: cursors[key].lineNumber,
            column: operation.rangeOffset,
          };
        }
      } else {
        cursors[key] = {
          lineNumber: operation.cursorPosition.lineNumber,
          column: operation.cursorPosition.column,
        };
      }
    }
  }
  return applyOperation(prev, operation);
};

const Server = ({ user, userId }: { user: any; userId: string }) => {
  const openFiles = useFileStore((state: any) => state.openFiles);
  useEffect(() => {
    const initilize = async (path: string) => {
      try {
        socket.on(`${user.id}-${path}+newUser`, (socketId: string) => {
          socket.emit(
            "newUserFileDataResponse",
            `${user.id}-${path}`,
            socketId,
            {
              newUser: true,
              value: getFileData(path),
              clientVersions: server_file_clientVersions[path],
              cursorPositions: server_file_cursorPositions[path],
              version: getVersion(path),
            }
          );
        });
        socket.on(`${user.id}-${path}-request`.trim(), (data: any) => {
          const event = data.event;
          const clientUser = data.user;
          var newValue = getFileData(path);
          if (event === undefined) return;
          for (let i = 0; i < event.length; i++) {
            const value = transform(event[i], newValue, path, clientUser);
            newValue = value;
          }
          const cr = server_file_cursorPositions[path][clientUser.id];
          if(cr != undefined){
            cr.user = clientUser;
          }
          setFileData(path, newValue as string);
          setVersion(path, getVersion(path) + 1);
          socket.emit(`serverChange`, {
            path: data.path,
            remoteId: data.remoteId,
            value: newValue,
            version: getVersion(path),
            clientVersions: server_file_clientVersions[path],
            cursorPositions: server_file_cursorPositions[path],
          });
          invoke("write_file" , {path:path , contents:newValue});
        });
        if (hasFileData(path)) return;
        const data = await invoke("read_file", { path: path });
        setFileData(path, data as string);
        socket.emit(`initialLoad`, `${user.id}-${path}`, {
          value: data,
          initial: true,
          clientVersions: server_file_clientVersions[path],
          cursorPositions: server_file_cursorPositions[path],
          version: getVersion(path),
        });
        setVersion(path, 0);
        server_file_operations[path] = [];
        server_file_clientVersions[path] = {};
        server_file_cursorPositions[path] = {};
      } catch (e) {
        console.log(e);
      }
    };
    for (let i = 0; i < openFiles.length; i++) {
      initilize(openFiles[i]);
    }
    return () => {
      for (let i = 0; i < openFiles.length; i++) {
        const path = openFiles[i];
        socket.off(`${user.id}-${path}+newUser`);
        socket.off(`${user.id}-${path}-request`);
      }
    };
  }, [user, userId, openFiles]);

  return <></>;
};

export default Server;
