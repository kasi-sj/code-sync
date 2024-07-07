"use client";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useFileStore } from "@/store";
import { getSize, isDirectory, readDirectory } from "@/utills";
import { socket } from "../socket";
import { FileEntry } from "@tauri-apps/api/fs";
import FileIcon from "@/components/FileIcon";
import File_DropDown from "./File_DropDown";
import Folder_DropDown from "./Folder_DropDown";
import { invoke } from "@tauri-apps/api/tauri";

const FileCard = ({
  path,
  files,
  openFile,
  reFetch,
}: {
  path: string;
  files: FileEntry[] | undefined;
  openFile: (path: any) => void;
  reFetch: () => void;
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
                reFetch={reFetch}
                path={path}
                comp={
                  <div
                    className={
                      "flex flex-row justify-start items-center gap-1 "
                    }
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
                        reFetch={reFetch}
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
          className={`p-2 hover:bg-slate-500 w-full${getSize(size+1)} text-gray-200 flex focus:bg-gray-200 scrollbar-hide overflow-auto`}
          onClick={() => {
            openFile(path);
          }}
        >
          <File_DropDown
            reFetch={reFetch}
            path={path}
            comp={
              <div
                className="flex flex-row justify-start items-center gap-1"
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
              </div>
            }
          />
        </button>
      )}
    </div>
  );
};

export default function App({ user, userId }: { user: any; userId: string }) {
  const directoryPath = useFileStore((state: any) => state.directoryPath);
  const openFiles = useFileStore((state: any) => state.openFiles) as string[];
  const setActiveFile = useFileStore((state: any) => state.setActiveFile);
  const addOpenFile = useFileStore((state: any) => state.addOpenFile);
  const setOpenFiles = useFileStore((state: any) => state.setOpenFiles);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const removeOpenFile = useFileStore((state: any) => state.removeOpenFile);
  const activeFile = useFileStore((state:any)=>state.activeFile);
  const reFetch = async () => {
    if (!directoryPath) return;
    const result = await isDirectory(directoryPath);
    if (result !== false) {
      setIsFolder(true);
      const files = await readDirectory(directoryPath);
      const allFiles = new Set<string>();
      const rec = (files: FileEntry[]) => {
        files.forEach((file) => {
          allFiles.add(file.path);
          if (file.children) {
            rec(file.children);
          }
        });
      };
      rec(files);
      for (let file of openFiles) {
        if (allFiles.has(file)) continue;
        else {
          removeOpenFile(file);
        }
      }
      setFiles(files);
      const data = {
        directoryPath: directoryPath,
        files: files,
      };
      socket.emit("update", data, userId);
      setActiveFile(activeFile);
    } else {
      setIsFolder(false);
    }

  };

  useEffect(() => {
    socket.on("newUserJoined", (to) => {
      const data = {
        directoryPath: directoryPath,
        files: files,
      };
      socket.emit("newUser", data, to);
    });
    socket.on("openFile", (path, socketId) => {
      addOpenFile(path);
    });
    socket.on("invokeFnRequest" , (type,obj) => {
      (async ()=>
        await invoke(type , obj))()
      reFetch();
    })
    const data = {
      directoryPath: directoryPath,
      files: files,
    };
    socket.emit("update", data, userId);

    return () => {
      socket.off("newUserJoined");
    };
  }, [ files , userId, directoryPath]);

  useEffect(()=>{
    setActiveFile("");
    setOpenFiles([]);
  },[directoryPath])

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

      socket.emit("rootServer", userId, user.name, (value: string) => {
        console.log(value);
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
  }, [openFiles, directoryPath, userId]);

  const openFile = (path: any) => {
    if (!openFiles.includes(path)) {
      addOpenFile(path);
    }
    setActiveFile(path);
  };

  const name = directoryPath.split("\\").pop();
  const [isFolder, setIsFolder] = useState(false);

  useEffect(() => {
    try {
      const checkType = async () => {
        if (!directoryPath) return;
        const result = await isDirectory(directoryPath);
        if (result !== false) {
          setIsFolder(true);
          const files = await readDirectory(directoryPath);
          const allFiles = new Set<string>();
          const rec = (files: FileEntry[]) => {
            files.forEach((file) => {
              allFiles.add(file.path);
              if (file.children) {
                rec(file.children);
              }
            });
          };
          rec(files);
          for (let file of openFiles) {
            if (allFiles.has(file)) continue;
            else {
              removeOpenFile(file);
            }
          }
          setFiles(files);
        } else {
          setIsFolder(false);
        }
      };
      checkType();
    } catch (e) {
      console.log(e);
    }
  }, [directoryPath]);
  const size = useFileStore((state: any) => state.size);

  return (
    <div className="bg-[rgb(23,23,23)] w-full h-full overflow-y-scroll text-gray-200 scrollbar-hide">
      <div className="flex flex-col border-l-1 h-full border-gray-400 w-full scrollbar-hide">
        <div className={`text-sm ${getSize(size+1)} font-bold text-gray-200 pt-5 px-5`}>
          EXPLORER
        </div>
        <div className="px-3 pt-2">
          <FileCard
            reFetch={reFetch}
            openFile={openFile}
            files={files}
            path={directoryPath}
          />
        </div>
      </div>
    </div>
  );
}
