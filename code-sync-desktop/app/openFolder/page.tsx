"use client";
import React, { useEffect } from "react";
import { useFileStore } from "@/store";
import { CircularProgress } from "@nextui-org/react";
import axios from "axios";
import ResizableContainer from "@/components/ResizableContainer";
import FileList from "@/components/FileList";
import FileTabs from "@/components/FileTabs";

const Loading = () => {
  return (
    <div className="flex justify-center h-full items-center ">
      <CircularProgress />
    </div>
  );
};
const Page = () => {
  const url = "https://track-me-backend-n5qp.onrender.com/users";
  const userId = useFileStore((state: any) => state.userId);
  const setUserId = useFileStore((state: any) => state.setUserId);
  const [user, setUser] = React.useState(null);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
  const setMode = useFileStore((state:any) => state.setMode);
  useEffect(() => {
    setMode("openFolder");
  }, []);
  useEffect(() => {
    const getUser = async () => {
      try {
        if (!userId) return;
        const user = await axios.get(url + `/${userId}`);
        setUser(user.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [userId]);

  return (
    <div className="bg-[rgb(23,23,23)] h-full " onClick={
      (e) => {setSelectedFile(null)}
    }>
      <ResizableContainer
        comp1={<FileList  />}
        comp2={<FileTabs  />}
      />
    </div>
  );
};

export default Page;
