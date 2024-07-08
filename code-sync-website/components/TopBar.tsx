"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFileStore } from "@/store";
import User from "./User";
import { Image, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { open } from "@tauri-apps/api/dialog";
import FileIcon from "./FileIcon";
import { getSize } from "@/utills";

const TopBar = () => {
  const Mode = useFileStore((state: any) => state.Mode);
  const setDirectoryPath = useFileStore((state: any) => state.setDirectoryPath);
  const setActiveFile = useFileStore((state: any) => state.setActiveFile);
  const setOpenFiles = useFileStore((state: any) => state.setOpenFiles);
  const directoryPath = useFileStore((state: any) => state.directoryPath);
  const size = useFileStore((state: any) => state.size);
  const router = useRouter();
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
    await openFile();
    // router.push(`/editor`);
  };
  return (
    <div className=" flex h-[55px] border-[0.5px] border-zinc-600 bg-[rgb(23,23,23)]">
      <div className="grid grid-cols-12 items-center w-screen">
        <div className=" flex flex-row col-span-6  gap-5 ml-2 ">
          <Link href={"/"}>
            <Image
              alt=""
              src="/codesync_transparent.png"
              className="h-14 w-auto object-cover "
            />
          </Link>
        </div>
        <div className="mr-2  col-span-6 flex justify-end">
          <User />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
