"use client";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, CircularProgress } from "@nextui-org/react";
import { useFileStore } from "@/store";
import { getSize, isDirectory, readDirectory } from "@/utills";
import { toast } from "react-toastify";
import { socket } from "../socket";
import { FileEntry } from "@tauri-apps/api/fs";
import FileIcon from "./FileIcon";
import File_DropDown from "./File_DropDown_Remote";
import Folder_DropDown from "./Folder_DropDown_Remote";

const FileCard = ({
  path,
  files,
  openFile,
  apiFn
}: {
  path: string;
  files: FileEntry[] | undefined;
  openFile: (path: any) => void;
  apiFn : (type:string , obj:any) => any;
}) => {
  const name = path.split("\\").pop();

  const selectedFile = useFileStore((state: any) => state.selectedFile);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
  const size = useFileStore((state: any) => state.size);
  return (
    <div className="bg-[rgb(23,23,23)] w-full -my-1">
      {files ? (
        <Accordion isCompact className=" ">
          <AccordionItem
            key={path}
            aria-label="Accordion 1"
            title={
              <Folder_DropDown
                invoke={apiFn}
                path={path}
                comp={<div className="flex flex-row justify-start items-center gap-1 "
                  onDoubleClick={(e) => {
                    console.log(e);
                    // if(e.touches.length<=1) return;
                    if (selectedFile === path) {
                      setSelectedFile(null);
                    } else {
                      setSelectedFile(path);
                    }
                  }}
                >
                <FileIcon file={name || ""} isdir={true} />
                <p className={`text-gray-200 ${getSize(size+1)} overflow-ellipsis truncate`}>
                  {name}
                </p>
              </div>
                }
                />
            }
          >
            <div className="flex flex-col border-l-1 border-gray-400 w-full scrollbar-hide">
              {files &&
                files.map((file) => {
                  return (
                    <div key={file.path}>
                      <FileCard
                      apiFn={apiFn}
                        openFile={openFile}
                        files={file.children}
                        path={file.path}
                      />
                    </div>
                  );
                })}
            </div>
          </AccordionItem>
        </Accordion>
      ) : (
        <button
          className={`p-2 hover:bg-slate-500 w-full ${getSize(size+1)} text-gray-200 flex focus:bg-gray-200 scrollbar-hide overflow-auto`}
          onClick={() => {
            openFile(path);
          }}
          
        >
          
          <File_DropDown
            path={path}
            invoke={apiFn}
            comp={<div className="flex flex-row justify-start items-center gap-1"
          onClick={() => {
            openFile(path);
          }}
          onDoubleClick={(e) => {
            console.log(e);
            // if(e.touches.length<=1) return;
            if (selectedFile === path) {
              setSelectedFile(null);
            } else {
              setSelectedFile(path);
            }
          }}
          
          >
            <FileIcon file={name || ""} isdir={false} />
            <p className={`text-gray-200 ${getSize(size+1)} overflow-ellipsis truncate`}>
              {name}
            </p>
          </div>} />
        </button>
      )}
    </div>
  );
};

export default function App({
  user,
  userId,
  remoteId,
}: {
  user: any;
  userId: string;
  remoteId: string;
}) {
  const [remotefiles, remotesetFiles] = useState<FileEntry[]>([]);
  const remotedirectoryPath = useFileStore(
    (state: any) => state.remotedirectoryPath
  );
  const remotesetDirectoryPath = useFileStore(
    (state: any) => state.remotesetDirectoryPath
  );
  const remoteopenFiles = useFileStore(
    (state: any) => state.remoteopenFiles
  ) as string[];
  const remotesetActiveFile = useFileStore(
    (state: any) => state.remotesetActiveFile
  );
  const remoteactiveFile = useFileStore((state: any) => state.remoteactiveFile);
  const remoteaddOpenFile = useFileStore(
    (state: any) => state.remoteaddOpenFile
  );
  const remotesetOpenFiles = useFileStore(
    (state: any) => state.remotesetOpenFiles
  );
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const remoteremoveOpenFile = useFileStore(
    (state: any) => state.remoteremoveOpenFile
  );

  useEffect(() => {
    socket.emit("joinRemote", remoteId, (data: string) => {
      console.log(data);
      socket.emit("newUserRequestFiles", remoteId);
    });
    socket.on("newUserResponse", (data) => {
      console.log(data.files);
      remotesetFiles(data.files);
      remotesetDirectoryPath(data.directoryPath);
    });
    socket.on("updateResponse", (data) => {
      if (data.directoryPath == remotedirectoryPath) {
        const allFiles = new Set<string>();
        const rec = (files: FileEntry[]) => {
          files.forEach((file) => {
            allFiles.add(file.path);
            if (file.children) {
              rec(file.children);
            }
          });
        };
        rec(data.files);
        for (let file of remoteopenFiles) {
          if (allFiles.has(file)) continue;
          else {
            remoteremoveOpenFile(file);
          }
        }
      } else {
        remotesetActiveFile("");
        remotesetOpenFiles([]);
      }
      remotesetFiles(data.files);
      remotesetDirectoryPath(data.directoryPath);
    });

    socket.on("updateStructureResponse", (data) => {
      remotesetDirectoryPath(data.directoryPath);
      const allFiles = new Set<string>();
      const rec = (files: FileEntry[]) => {
        files.forEach((file) => {
          allFiles.add(file.path);
          if (file.children) {
            rec(file.children);
          }
        });
      };
      rec(data.files);
      for (let file of remoteopenFiles) {
        if (allFiles.has(file)) continue;
        else {
          remoteremoveOpenFile(file);
        }
      }
      remotesetFiles(data.files);
    });

    const remove = (file: any) => {
      if (remoteactiveFile == file) {
        remoteremoveOpenFile(file);
        for (let i = 0; i < remoteopenFiles.length; i++) {
          if (remoteopenFiles[i] != file) {
            remotesetActiveFile(remoteopenFiles[i]);
            break;
          }
        }
      } else {
        remoteremoveOpenFile(file);
      }
      socket.emit("removeFile", file, userId);
    };

    socket.on("removeFileResponse", (file) => {
      remove(file);
    });
    return () => {};
  }, [userId, user]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [remoteopenFiles, remotedirectoryPath, userId]);

  const openFile = (path: any) => {
    if (!remoteopenFiles.includes(path)) {
      socket.emit("openFileRequest", remoteId, path);
      remoteaddOpenFile(path);
    }
    remotesetActiveFile(path);
  };

  const apiFn = (type:string , obj:any)=>{
    socket.emit("invokeFn", type, obj , remoteId);
  }
  const size = useFileStore((state: any) => state.size);
  const name = remotedirectoryPath.split("\\").pop();

  if(remotedirectoryPath === "") return <div className={`flex flex-row justify-start h-full items-start mt-5 text-gray-200 `}>
  <CircularProgress />
</div>
  return (
    <div className="bg-[rgb(23,23,23)] w-full h-full overflow-y-scroll text-gray-200 scrollbar-hide">
      <div className="flex flex-col border-l-1 h-full border-gray-400 w-full scrollbar-hide">
        <div className={`${getSize(size+1)} font-bold text-gray-200 pt-5 px-5`}>
          EXPLORER
        </div>
        <div className="px-3 pt-2">
          <FileCard
            apiFn={apiFn}
            openFile={openFile}
            files={remotefiles}
            path={remotedirectoryPath}
          />
        </div>
      </div>
    </div>
  );
}
