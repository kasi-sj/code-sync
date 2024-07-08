"use client";
import React from "react";
import SampleSplitter from "@/components/SampleSplitter";
import { useResizable } from "react-resizable-layout";

const ResizableContainer = ({
  comp1,
  comp2,
}: {
  comp1: JSX.Element;
  comp2: JSX.Element;
}): JSX.Element => {
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 200,
    min: 100,
  });

  return (
    <div className="bg-black flex flex-row h-full w-screen  font-mono overflow-hidden">
      <div
        className={
          "flex-shrink-0 grid place-items-center transition filter ease-out duration-200 "
        }
        style={{ width: fileW }}
      >
        {comp1}
      </div>
      <SampleSplitter
        dir="vertical"
        isDragging={isFileDragging}
        {...fileDragBarProps}
        className="bg-zinc-600 cursor-col-resize w-1  hover:w-[6px] hover:bg-blue-600 h-full"
      />
      <div className="flex flex-grow h-full w-full">{comp2}</div>
    </div>
  );
};

export default ResizableContainer;
