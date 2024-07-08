"use client";
import React, { useEffect } from "react";
import { useFileStore } from "@/store";
import { CircularProgress } from "@nextui-org/react";
import axios from "axios";
import ResizableContainer from "@/components/ResizableContainer";
import FileListServer from "@/components/FileListServer";
import FileTabs from "@/components/FileTabsServer";

const Loading = () => {
  return (
    <div className={`flex flex-col p-2 justify-center h-full items-center text-gray-200 `}>
      <CircularProgress />
      <p>Please make sure you are logged in and have selected a file.</p>
    </div>
  );
};

const Page = () => {
  const url = "https://track-me-backend-n5qp.onrender.com/users";
  const userId = useFileStore((state: any) => state.userId);
  const setUserId = useFileStore((state: any) => state.setUserId);
  const [user, setUser] = React.useState(null);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
  const setMode = useFileStore((state: any) => state.setMode);
  useEffect(() => {
    setMode("editor");
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

  if (!userId || userId === "" || !user) {
    return <Loading />;
  }

  return (
    <div
      className={`bg-[rgb(23,23,23)] h-full `}
      onClick={(e) => {
        setSelectedFile(null);
      }}
    >
      <ResizableContainer
        comp1={<FileListServer user={user} userId={userId} />}
        comp2={<FileTabs user={user} userId={userId} />}
      />
    </div>
  );
};

export default Page;
