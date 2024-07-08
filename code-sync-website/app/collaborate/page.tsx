"use client";
import React, { useEffect } from "react";
import { useFileStore } from "@/store";
import { CircularProgress } from "@nextui-org/react";
import axios from "axios";
import ResizableContainer from "@/components/ResizableContainer";
import FileListRemote from "@/components/FileListRemote";
import FileTabs from "@/components/FileTabsRemote";


const Loading = () => {
  return (
    <div className={`flex flex-col p-2 justify-center h-full items-center text-gray-200 `}>
      <CircularProgress />
      <p>
          Please make sure you are logged in and have provided a valid remote id
        </p>
    </div>
  );
};

const Page = () => {
  const url = "https://track-me-backend-n5qp.onrender.com/users";
  const userId = useFileStore((state: any) => state.userId);
  const [user, setUser] = React.useState(null);
  const setSelectedFile = useFileStore((state: any) => state.setSelectedFile);
  const remoteId = useFileStore((state: any) => state.remoteId);
  const setMode = useFileStore((state:any) => state.setMode);
  useEffect(() => {
    setMode("collaborate");
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

  if (remoteId === "") {
    return <Loading />;
  }

  if (!userId || userId === "" || !user) {
    return <Loading />;
  }

  return (
    <div className={`bg-[rgb(23,23,23)]  h-full`} onClick={
      (e) => {setSelectedFile(null)}
    }>
      <ResizableContainer
        comp1={<FileListRemote user={user} userId={userId} remoteId={remoteId} />}
        comp2={<FileTabs user={user} userId={userId} remoteId={remoteId} />}
      />
    </div>
  );
};

export default Page;
