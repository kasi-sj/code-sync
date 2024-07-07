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
import { invoke } from "@tauri-apps/api/tauri";

const Folder_dropdown = ({
  comp,
  path,
  reFetch,
}: {
  comp: JSX.Element;
  path: string;

  reFetch: () => void;
}) => {
  const selectedFile = useFileStore((state: any) => state.selectedFile);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
    const setDirectoryPath = useFileStore((state: any) => state.setDirectoryPath);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const directoryPath = useFileStore((state: any) => state.directoryPath);
  const [modelName, setModelName] = React.useState("");
  const onFileCreate = async (name: string) => {
    if(name == "") return;
    await invoke("create_file", { path: path , name: name });
    console.log("path", name, "new file");
    reFetch();
  };
  const onFolderCreate = async (name: string) => {
    if(name == "") return;
    await invoke("create_folder", { path: path , name: name });
    console.log("path", name, "new folder");
    reFetch();
  };
  const onRename = async (name: string) => {
    if(name == "") return;
    await invoke("rename_folder", { path: path , newName: name });
    console.log("path", name, "rename");
    if(directoryPath == path){
      setDirectoryPath(directoryPath.split("/").slice(0,-1).join("/")+`/${name}`);
    }
    reFetch();
  };
  const onDelete = async () => {
    await invoke("delete_folder_recursive", { path: path });
    console.log("path", path, "delete");
    reFetch();
  };

  return (
    <div>
      <ModelComponent
        header={
            
          modelName == "new file"
          ? "Create File"
          : modelName == "new folder"
          ? "Create Folder"
          : "Rename Folder"
        }
        isOpen={modelName != ""}
        setIsOpen={() => {
          setModelName("");
        }}
        onSubmmit={
          modelName == "new file"
            ? onFileCreate
            : modelName == "new folder"
            ? onFolderCreate
            : onRename
        }
        title={
          modelName == "new file"
            ? "Create"
            : modelName == "new folder"
            ? "Create"
            : "Rename"
        }
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
              if (modelName == "") setModelName("new file");
              else setModelName("");
            }}
            key="new"
            shortcut="⌘N"
            startContent={<AddNoteIcon className={iconClasses} />}
          >
            New file
          </DropdownItem>
          <DropdownItem
            onClick={(e) => {
              if (modelName == "") setModelName("new folder");
              else setModelName("");
            }}
            key="open Folder"
            shortcut="⌘O"
            startContent={<FaFolderOpen className={iconClasses} />}
          >
            New Folder
          </DropdownItem>
          <DropdownItem
            onClick={(e) => {
              if (modelName == "") setModelName("rename");
              else setModelName("");
            }}
            key="rename"
            shortcut="⌘R"
            startContent={<EditDocumentIcon className={iconClasses} />}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            onClick={onDelete}
            key="delete"
            shortcut="⌘D"
            startContent={<DeleteDocumentIcon className={iconClasses} />}
            color="danger"
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Folder_dropdown;
