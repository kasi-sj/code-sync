"use client";
import { useFileStore } from "@/store";
import { Image, Tab, Tabs } from "@nextui-org/react";
import ClientEditor from "@/components/ClientEditor";
import { AiOutlineClose } from "react-icons/ai";
import { socket } from "../socket";
import Server from "./Server";
import TerminalController from "./TerminalController";
import ResizableContainer from "./ResizableContainerHorizontal";
import { useEffect, useRef, useState } from "react";
import { useResizable } from "react-resizable-layout";
import SampleSplitter from "./SampleSplitter";
import FileIcon from "./FileIcon";
import { getSize } from "@/utills";

const FileTab = ({ userId, user }: { userId: string; user: any }) => {
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: "y",
    initial: 200,
    min: 100,
    max: 900,
  });
  return (
    <div className="w-full h-full flex-grow">
      <Server user={user} userId={userId} />
      <div className="bg-black flex flex-col h-full  w-full  font-mono overflow-hidden">
        <div
          className={
            "flex-shrink-0 grid  place-items-center transition filter ease-out duration-200 "
          }
          style={{ height: fileW }}
        >
          <TabComponent height={fileW} userId={userId} user={user} />
        </div>
        <SampleSplitter
          dir="horizontal"
          isDragging={isFileDragging}
          {...fileDragBarProps}
        />
        <div className="flex flex-grow w-full h-full">
          <TerminalController />
        </div>
      </div>
    </div>
  );
};

const TabComponent = ({
  height,
  userId,
  user,
}: {
  height: number;
  userId: string;
  user: any;
}) => {
  const openFiles = useFileStore((state: any) => state.openFiles);
  const activeFile = useFileStore((state: any) => state.activeFile);
  const setActiveFile = useFileStore((state: any) => state.setActiveFile);
  const removeOpenFile = useFileStore((state: any) => state.removeOpenFile);
  const containerRef = useRef(null);
  const size = useFileStore((state:any)=>state.size);
  const handleClick = (file: any) => {
    if (activeFile == file) {
      removeOpenFile(file);
      for (let i = 0; i < openFiles.length; i++) {
        if (openFiles[i] != file) {
          setActiveFile(openFiles[i]);
          break;
        }
      }
    } else {
      removeOpenFile(file);
    }
    socket.emit("removeFile", file, userId);
  };

  return (
    <div className=" h-full bg-[rgb(32,32,32)]  w-full flex-grow">
      {openFiles.length > 0 ? (
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
          selectedKey={activeFile}
          onSelectionChange={(key: any) => {
            setActiveFile(key);
          }}
        >
          {openFiles && openFiles.map((file: string) => (
            <Tab
              className="h-full "
              key={file}
              title={
                <div className="flex flex-row  items-center justify-center space-x-2">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <FileIcon file={file} isdir={false} />
                    <p className={`text-gray-400 ${getSize(size)}`}>{file.split("\\").pop()}</p>
                  </div>
                  <button className="mt-0.5" onClick={() => handleClick(file)}>
                    <AiOutlineClose color="white" />
                  </button>
                </div>
              }
            >
              <div
                className={` bg-[rgb(32,32,32)]   gap-20`}
                style={{
                  height: height - 60,
                }}
              >
                <ClientEditor remoteId={user.id + ""} user={user} path={file} />
              </div>
            </Tab>
          ))}
        </Tabs>
      ) : (
        <div className="flex flex-col h-full grid-cols-9 items-center justify-center gap-10">
          <Image
            alt=""
            src="/codesync_transparent.png"
            className="h-64  w-auto object-cover "
          />
          <p className="text-gray-400 text-2xl">No File Opened</p>
          <p className="text-gray-700 ">open a file to start coding</p>
        </div>
      )}
    </div>
  );
};

export default FileTab;
