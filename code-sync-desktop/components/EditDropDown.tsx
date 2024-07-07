import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn} from "@nextui-org/react";
import {AddNoteIcon} from "./AddNoteIcon";
import {CopyDocumentIcon} from "./CopyDocumentIcon";
import { MdContentPasteGo } from "react-icons/md";
import { MdOutlineSelectAll } from "react-icons/md";
import { useFileStore } from "@/store";
import { invoke } from "@tauri-apps/api/tauri";
import { getSize } from "@/utills";



export default function App() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const size = useFileStore((state: any) => state.size);
  
  const activeFile = useFileStore((state: any) => state.activeFile);

  const onCopy = async () => {
    if(!activeFile) return;
    const data = await invoke("read_file", { path: activeFile });
    console.log(data);
    navigator.clipboard.writeText(data as string);
  };

  const onPaste = async () => {
    if(!activeFile) return;
    const data = await navigator.clipboard.readText();
    invoke("write_file", { path: activeFile, contents: data });
  };

  return (
    <Dropdown className="bg-[rgb(23,23,23)] ">
      <DropdownTrigger>
        <button 
        className={`w-10 p-1 items-center h-full ${getSize(size+1)} text-white focus:outline-none`}
        >
          Edit
        </button>
      </DropdownTrigger>
      <DropdownMenu className="bg-[rgb(23,23,23)] text-gray-400" variant="faded" aria-label="Dropdown menu with icons">
        <DropdownItem
          onClick={() => {
            onCopy();
          }}
          key="copy"
          shortcut="⌘C"
          startContent={<CopyDocumentIcon className={iconClasses} />}
        >
          Copy 
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            onPaste();
          }}
          key="paste"
          shortcut="⌘V"
          startContent={<MdContentPasteGo className={iconClasses} />}
        >
          Paste 
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
