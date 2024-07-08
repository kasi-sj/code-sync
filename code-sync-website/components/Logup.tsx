"use client";
import React, { useEffect } from "react";
import { Card, Spacer, Button, Input, Checkbox, CircularProgress } from "@nextui-org/react";
import { Mail } from "./Mail";
import { Password } from "./Password";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useFileStore } from "@/store";

export default function Logup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [localData, setData] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const warn = (data: any) => toast.warn(data);
  const success = (data: any) => toast.success(data);
  const error = (data: any) => toast.error(data);
  const url = "https://track-me-backend-n5qp.onrender.com/users";
  const setMode = useFileStore((state:any) => state.setMode);
  useEffect(() => {
    setMode("logup");
  }, []);
  const onSubmit = async (event: any) => {
    
    event.preventDefault();
    if (!email || !password || !name) {
      warn("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(url, {
        user: {
          name: name,
          email: email,
          password: password,
        },
      });
      const user = response.data.user;
      if (user) {
        success(
          "Email verification link has been send to your account please verify it and login again"
        );
      } else {
        error("Error signing up , please try again later");
      }
    } catch (e) {
      error("Error signing up , please try again later");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full bg-[rgb(23,23,23)] flex-col items-center justify-center ">
      <Card className="max-w-lg p-4 border">
        <p className="text-center  text-lg font-bold mx-3 mb-4">
          Create account
        </p>
        <div className="flex flex-row items-start gap-5">
          <IoPersonCircleOutline size={40} />

          <Input
            fullWidth
            size="lg"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Spacer y={1} />
        <div className="flex flex-row items-start gap-5">
          <Mail
            fill="currentColor"
            size={40}
            height={undefined}
            width={undefined}
          />
          <Input
            fullWidth
            size="lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Spacer y={1} />
        <div className="flex flex-row items-start justify-center gap-5">
          <Password
            fill="currentColor"
            size={40}
            height={undefined}
            width={undefined}
          />
          <Input
            fullWidth
            size="lg"
            placeholder="Password"
            className="mb-6"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Spacer y={1} />
        <Button onClick={onSubmit} disabled={isLoading}>

          {isLoading ? (
            <div className="">
              <CircularProgress size="sm" />
            </div>
          ) : (
            "Sign up"
          )}
        </Button>
      </Card>
      <div className="flex flex-col pt-5 items-center justify-center">
        <h3
          className="
            text-slate-500
            font-semibold
        "
        >
          {"Already have an account ?"}
        </h3>

        <a className="text-white" href="/login">
          Log in here
        </a>
      </div>
    </div>
  );
}
