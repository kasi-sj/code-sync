"use client";
import { useFileStore } from "@/store";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { open } from "@tauri-apps/api/dialog";
const Select = () => {
  const [remoteIdLocal, setRemoteIdLocal] = useState("");
  const setRemoteId = useFileStore((state: any) => state.setRemoteId);
  const setDirectoryPath = useFileStore((state: any) => state.setDirectoryPath);
  const router = useRouter();
  const setMode = useFileStore((state:any) => state.setMode);
  useEffect(() => {
    setMode("");
  }, []);
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
    }
    return true;
  }
  const selectDirectory = async () => {
    console.log("comming");
    if (await openFile()) router.push(`/openFolder`);
  };

  const collaborate = () => {
    setRemoteId(remoteIdLocal);
    router.push(`/collaborate`);
  };

  const selectDirectoryAndCollaborate = async () => {
    if (await openFile()) router.push(`/editor`);
  };

  const terminal = () => {
    router.push(`/terminal`);
  };

  return (
    <div className="flex flex-col justify-center items-start mt-4 gap-1  bg-[rgb(23,23,23)]">
      {/* <div>
        <Button
          className="px-2 bg-zinc-600 text-white"
          onClick={terminal}
        >
          Open Terminal
        </Button>
      </div> */}
      <div className="flex flex-row gap-5">
        <div>
          <Button
            className="px-2 bg-zinc-600 text-white"
            onClick={selectDirectory}
          >
            Open Directory
          </Button>
        </div>
        <div>
          <Button
            className="px-2 bg-[rgb(56,91,172)] text-white"
            onClick={selectDirectoryAndCollaborate}
          >
            Collaborate
          </Button>
        </div>
      </div>
      <p className="text-white pl-5">or</p>
      <div className="flex flex-row gap-3 items-center justify-center">
        <Input
          placeholder="Remote ID"
          value={remoteIdLocal}
          onChange={(e) => setRemoteIdLocal(e.target.value)}
        />
        <Button className="px-3 bg-[rgb(56,91,172)] text-white" onClick={collaborate}>
          Join
        </Button>
      </div>
    </div>
  );
};

export default Select;
