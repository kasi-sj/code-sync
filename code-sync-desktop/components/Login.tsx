"use client"
import React, { useEffect } from "react";
import { Card, Spacer, Button, Input, Checkbox, CircularProgress } from "@nextui-org/react";
import { Mail } from "./Mail";
import { Password } from "./Password";
import {  saveData } from "@/utills";
import { useFileStore } from "@/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const url = "https://track-me-backend-n5qp.onrender.com/signIn";
  const setUserId = useFileStore((state: any) => state.setUserId);
  const setMode = useFileStore((state:any) => state.setMode);
  useEffect(() => {
    setMode("login");
  }, []);
  
  const warn = (data: any) => toast.warn(data);
  const success = (data: any) => toast.success(data);
  const error = (data: any) => toast.error(data);
  const save = async (key: string, value: any): Promise<void> => {
    await saveData(key,value)
  }

  const onSubmit = async (event: any) => {
    console.log("came here")
    event.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      warn("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    try {
      try {
        const response = await axios.post(
          url,
          {
            email: email,
            password: password,
          }
        );
        const user = response.data.user;
        if (user) {
          setUserId(user.id);
          save("userId", user.id);
        } else {
          error("Error signing up , please try again later");
          return;
        }
      } catch (e) {
        error("Error signing up, please try again later");
        return;
      }
      success("Sign up successful");
      setIsLoading(false);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };


  return (
    <div className="flex flex-col h-full bg-[rgb(23,23,23)] items-center justify-center ">
      <Card className="max-w-md p-4 border ">
        <p className="text-center mb-4 text-lg font-bold">{"Welcome back :)"}</p>
        <div className="flex flex-row items-start gap-5">
          <Mail
            fill="currentColor"
            size={40}
            height={undefined}
            width={undefined}
          />
          <Input fullWidth  size="lg" placeholder="Email" 
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Spacer y={1} />
        <Button disabled={isLoading} onClick={onSubmit} className="py-1"> 
          {isLoading ? (
            <div className="">
            <CircularProgress size="sm" />
            </div>
          )  :
          "Sign in"
          }
        </Button>
      </Card>
      <div className="flex flex-col pt-10 items-center justify-center">
        <h3 className="
            text-slate-500
            font-semibold
        ">{"Don't have an account yet ?"}</h3>
        
        <a className="text-white" href="/logup">
            Create an account
        </a>
      </div>
    </div>
  );
}
