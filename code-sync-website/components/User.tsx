"use client";
import { useFileStore } from "@/store";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { Chip } from "@nextui-org/chip";
import { removeData } from "@/utills";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

const User = () => {
  const url = "https://track-me-backend-n5qp.onrender.com/users";

  const userId = useFileStore((state: any) => state.userId);
  const setUserId = useFileStore((state: any) => state.setUserId);

  const [user, setUser] = React.useState(null);
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

  const signOut = () => {
    setUserId(undefined);
    setUser(null);
    removeData("userId");
    toast.info("You have been signed out");
  };

  return (
    <div >
      {user && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform h-6 w-6 text-[10px]"
              color="default"
              name={(user as any).name}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2 text-black">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{(user as any).email}</p>
            </DropdownItem>
            <DropdownItem key="help_and_feedback" className="text-black">Help & Feedback</DropdownItem>
            <DropdownItem key="help_and_feedback" className="text-black">Id : {userId}</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={signOut} className="text-black">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {user ? null : (
        <Link href="/login">
          <Chip size="sm" className="bg-slate-500 text-xs px-1 rounded-lg h-6">
            Sign In
          </Chip>
        </Link>
      )}
    </div>
  );
};

export default User;
