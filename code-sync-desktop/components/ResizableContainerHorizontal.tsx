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
    axis: "y",
    initial: 200,
    min: 100,
    max: 900
  });

  return (
    <div className="bg-black flex flex-col h-full  w-full  font-mono overflow-hidden">
      <div
        className={
          "flex-shrink-0 grid  place-items-center transition filter ease-out duration-200 "
        }
        style={{ height: fileW }}
      >
        {comp1}
      </div>
      <SampleSplitter
        dir="horizontal"
        isDragging={isFileDragging}
        {...fileDragBarProps}
      />
      <div className="flex flex-grow w-full h-full">{comp2}</div>
    </div>
  );
};

export default ResizableContainer;
