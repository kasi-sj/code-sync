import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from "@nextui-org/react";
import { AddNoteIcon } from "./AddNoteIcon";
import { MdContentPasteGo, MdOutlineFileOpen } from "react-icons/md";
import { EditDocumentIcon } from "./EditDocumentIcon";
import { DeleteDocumentIcon } from "./DeleteDocumentIcon";
import { FaFolderOpen } from "react-icons/fa";
import { CopyDocumentIcon } from "./CopyDocumentIcon";
import { useFileStore } from "@/store";
import ModelComponent from "./ModelComponent";

const File_dropdown = ({
  invoke,
  comp,
  path,
}: {

  comp: JSX.Element;
  path: string;
  invoke : (type:string , obj:any)=>any;
}) => {
  const selectedFile = useFileStore((state: any) => state.selectedFile);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const onCopy = async () => {
    const data = await invoke("read_file", { path: path });
    navigator.clipboard.writeText(data as string);
  };

  const onPaste = async () => {
    const data = await navigator.clipboard.readText();
    invoke("write_file", { path: path, contents: data });
  };

  const onDelete = async () => {
    invoke("delete_file", { path: path });
  };

  const onRename = async (name: string) => {
    if (name == "") return;
    console.log("path", name, "rename");
    try{
        await invoke("rename_file", { path: path, newName: name });
    }catch(e){
        console.log(e);
    }
  }
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <div>
      <ModelComponent
        header="Rename File"
        isOpen={isModelOpen}
        setIsOpen={() => {
          setIsModelOpen(false);
        }}
        onSubmmit={onRename}
        title={"Rename"}
      />
      <Dropdown className="bg-[rgb(23,23,23)]" isOpen={selectedFile == path}>
        <DropdownTrigger>{comp}</DropdownTrigger>
        <DropdownMenu
          className=" bg-[rgb(23,23,23)] text-gray-400"
          variant="faded"
          aria-label="Dropdown menu with icons"
        >
          <DropdownItem
            onClick={(e) => {
                setIsModelOpen(true);
            }}
            key="rename"
            shortcut="⌘R"
            startContent={<EditDocumentIcon className={iconClasses} />}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            onClick={(e) => {
              onDelete();
              setSelectedFile(null);
            }}
            key="delete"
            className="text-danger"
            color="danger"
            shortcut="⌘⇧D"
            startContent={
              <DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />
            }
          >
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default File_dropdown;
