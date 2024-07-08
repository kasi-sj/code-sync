"use client";
import { useFileStore } from "@/store";
import { CircularProgress, Image, Tab, Tabs } from "@nextui-org/react";
import ClientEditor from "@/components/ClientEditor";
import { AiOutlineClose } from "react-icons/ai";
import { socket } from "../socket";
import { useEffect } from "react";
import FileIcon from "./FileIcon";
import { getSize } from "@/utills";

const FileTab = ({
  userId,
  user,
  remoteId,
}: {
  userId: string;
  user: any;
  remoteId: string;
}) => {
  const remotedirectoryPath = useFileStore(
    (state: any) => state.remotedirectoryPath
  );
  const remoteopenFiles = useFileStore((state: any) => state.remoteopenFiles);
  const remoteactiveFile = useFileStore((state: any) => state.remoteactiveFile);
  const remotesetActiveFile = useFileStore(
    (state: any) => state.remotesetActiveFile
  );
  const remoteremoveOpenFile = useFileStore(
    (state: any) => state.remoteremoveOpenFile
  );
  const size = useFileStore((state: any) => state.size);
  const handleClick = (file: any) => {
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
  };

  if (remotedirectoryPath === "")
    return (
      <div
        className={`flex flex-col justify-center items-center gap-5 h-full w-full mt-5 text-gray-400 `}
      >
        <CircularProgress />
        <div className="flex flex-col items-center justify-center gap-2">
          <p>connecting to {remoteId}</p>
          <p> waiting for server to connect... </p>
          <p>make sure remote id is correct and remote is running</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-full  bg-[rgb(23,23,23)] flex-col w-full">
      {remoteopenFiles.length > 0 ? (
        <Tabs
          //@ts-ignore
          color="primary"
          aria-label="Options"
          key={"none"}
          className={
            "bg-[rgb(32,32,32)] w-full  overflow-x-scroll scrollbar-hide"
          }
          radius={"none"}
          variant="underlined"
          onSelectionChange={(key: any) => {
            remotesetActiveFile(key);
          }}
        >
          {remoteopenFiles.map((file: string) => (
            <Tab
              className="h-full "
              key={file}
              title={
                <div className="flex flex-row  items-center justify-center space-x-2">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <FileIcon file={file} isdir={false} />
                    <p className={`text-gray-400  ${getSize(size)}`}>
                      {file.split("\\").pop()}
                    </p>
                  </div>
                  <button className="mt-0.5" onClick={() => handleClick(file)}>
                    <AiOutlineClose color="white" />
                  </button>
                </div>
              }
            >
              <div className={` bg-[rgb(32,32,32)] h-full `}>
                <ClientEditor user={user} remoteId={remoteId} path={file} />
              </div>
            </Tab>
          ))}
        </Tabs>
      ) : (
        <div className="flex flex-col h-full items-center justify-center gap-10">
          <Image
            alt=""
            src="/codesync_transparent.png"
            className="h-64 w-auto object-cover "
          />
          <p className="text-gray-400 text-2xl">No File Opened</p>
          <p className="text-gray-700 ">open a file to start coding</p>
        </div>
      )}
    </div>
  );
};
export default FileTab;
