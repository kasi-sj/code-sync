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
import { MdOutlineFileOpen } from "react-icons/md";
import { EditDocumentIcon } from "./EditDocumentIcon";
import { DeleteDocumentIcon } from "./DeleteDocumentIcon";
import { FaFolderOpen } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { invoke } from "@tauri-apps/api/tauri";
import { useFileStore } from "@/store";
import { getSize, isDirectory, readDirectory } from "@/utills";
import ModelComponent from "./ModelComponent";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { open } from "@tauri-apps/api/dialog";
import { FileEntry } from "@tauri-apps/api/fs";

export default function App() {
  const directoryPath = useFileStore((state: any) => state.directoryPath);
  const setDirectoryPath = useFileStore((state: any) => state.setDirectoryPath);
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const openFiles = useFileStore((state: any) => state.openFiles) as string[];
  const size = useFileStore((state: any) => state.size);

  const [isFolderModelOpen, setIsFolderModelOpen] = React.useState(false);
  const router = useRouter();
  const removeOpenFile = useFileStore((state: any) => state.removeOpenFile);
  const reFetch = async () => {
    if (!directoryPath) return;
    const result = await isDirectory(directoryPath);
    if (result !== false) {
      const dir = directoryPath;
      setDirectoryPath("");
      const files = await readDirectory(dir);
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
      setTimeout(() => {
        setDirectoryPath(dir);
      }, 1000);
      for (let file of openFiles) {
        if (allFiles.has(file)) continue;
        else {
          removeOpenFile(file);
        }
      }

    } else {
    }
  };

  const onNewFile = async (name: string) => {
    await invoke("create_file", { path: directoryPath, name: name });
    reFetch();
  };
  const onNewFolder = async (name: string) => {
    await invoke("create_folder", { path: directoryPath, name: name });
    reFetch();
  };
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  async function openFile() {
    const selected = await open({
      directory: true,
    });
    if (selected === null) {
      toast("No directory selected");
      return false;
    } else {
      setDirectoryPath(selected);
      toast.info(selected);
      router.push(`/openFolder`);
    }
    return true;
  }

  return (
    <div>
      <Dropdown className="bg-[rgb(23,23,23)] ">
        <DropdownTrigger>
          <button className={`w-10 p-1 items-center h-full ${getSize(size+1)} text-white focus:outline-none`}>
            File
          </button>
        </DropdownTrigger>
        <DropdownMenu
          className=" bg-[hsl(0,0%,9%)] text-gray-400"
          variant="faded"
          aria-label="Dropdown menu with icons"
        >
          <DropdownItem
            onClick={() => {
              setIsModelOpen((prev) => !prev);
            }}
            key="new"
            shortcut="⌘N"
            startContent={<AddNoteIcon className={iconClasses} />}
          >
            New file
          </DropdownItem>

          <DropdownItem
            onClick={() => {
              setIsFolderModelOpen((prev) => !prev);
            }}
            key="new folder"
            shortcut="⌘⇧N"
            startContent={<MdOutlineFileOpen className={iconClasses} />}
          >
            New folder
          </DropdownItem>
          <DropdownItem
            onClick={async () => {
              await openFile();
            }}
            key="open folder"
            shortcut="⌘⇧O"
            startContent={<FaFolderOpen className={iconClasses} />}
          >
            Open folder
          </DropdownItem>
          <DropdownItem
            onClick={async () => {
              await invoke("close_app");
            }}
            color="danger"
            key="close"
            shortcut="⌘W"
            startContent={<AiOutlineClose size="20" color="white" />}
          >
            Close
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ModelComponent
        header="Create a File"
        isOpen={isModelOpen}
        setIsOpen={() => {
          setIsModelOpen(false);
        }}
        onSubmmit={onNewFile}
        title={"Create"}
      />
      <ModelComponent
        header="Create a Folder"
        isOpen={isFolderModelOpen}
        setIsOpen={() => {
          setIsFolderModelOpen(false);
        }}
        onSubmmit={onNewFolder}
        title={"Create"}
      />
    </div>
  );
}
