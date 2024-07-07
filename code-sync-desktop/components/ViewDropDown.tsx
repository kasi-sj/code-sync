import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn} from "@nextui-org/react";

import { CiZoomIn } from "react-icons/ci";
import { CiZoomOut } from "react-icons/ci";
import { useFileStore } from "@/store";
import { getSize } from "@/utills";


export default function App() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const increaceSize = useFileStore((state: any) => state.increaceSize);
  const decreaseSize = useFileStore((state: any) => state.decreaseSize);
  const size = useFileStore((state: any) => state.size);
  return (
    <Dropdown className="bg-[rgb(23,23,23)]">
      <DropdownTrigger>
        <button 
        className={`w-10 p-1 items-center h-full ${getSize(size+1)} text-white focus:outline-none`}
        >
          View
        </button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" className="bg-[rgb(23,23,23)]  text-gray-400" aria-label="Dropdown menu with icons">
      <DropdownItem
          onClick={() => {
            increaceSize();
          }}
          key="copy"
          shortcut="⌘⇧+"
          startContent={<CiZoomIn className={iconClasses} />}
        >
          Zoom in 
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            decreaseSize();
          }}
          key="copy"
          shortcut="⌘⇧-"
          startContent={<CiZoomOut className={iconClasses} />}
        >
          Zoom out 
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
