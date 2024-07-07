"use client";
import React, { useEffect, useState } from "react";
import { Terminal } from "primereact/terminal";
import { TerminalService } from "primereact/terminalservice";
import { invoke } from "@tauri-apps/api/tauri";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useFileStore } from "@/store";
import { MdOutlineTerminal } from "react-icons/md";
import { getSize } from "@/utills";

var id = -1;
const outputs: React.JSX.Element[] = [];
const TerminalController = () => {
  const [terminalLineData, setTerminalLineData] = useState<any[]>([]);

  const directoryPath = useFileStore((state: any) => state.directoryPath);
  const cwd = directoryPath || "/"; // Use root directory if directoryPath is empty or undefined

  const executeCommand = async (command: string) => {
    setTerminalLineData((prevData) => [...prevData]);
    if (command == "cls") {
      TerminalService.emit("clear");
      return;
    } else if (command.startsWith("cd ")) {
      await invoke("execute_command", { command: "cmd.exe /K " + command });
      return;
    }
    try {
      await invoke("execute_command", { command });
    } catch (e) {
      console.log(e);
    }
  };

  const handleTerminalInput = (terminalInput: string) => {
    while(outputs.length > 0) outputs.pop();
    executeCommand(terminalInput);
  };

  useEffect(() => {
    const initTerminal = async () => {
      try {
        await invoke("start_terminal", { directory: cwd });
        await listen("terminal-output", (event: any) => {
          if (id === -1) {
            id = event.id;
          }
          if (id !== event.id) {
            return;
          }
          if (event.payload.output === "") return;
          outputs.push(
            <p className={`${event.payload.stderr && "text-red-800"}`}>{`$ ${
              event.payload.output as string
            } \n`}</p>
          );
          if (event.payload.output) {
            TerminalService.emit(
              "response",
              <div>
                {outputs.map((output) => {
                  return output;
                })}
              </div>
            );
          }
        });
        console.log("came here");
      } catch (e) {
        console.log(e);
      }
    };

    initTerminal();
    return () => {};
  }, [cwd, directoryPath]);

  useEffect(() => {
    TerminalService.emit("clear");
    return;
  }, [directoryPath]);

  useEffect(() => {
    TerminalService.on("command", handleTerminalInput);

    return () => {
      TerminalService.off("command", handleTerminalInput);
    };
  }, []);
  const size = useFileStore((state: any) => state.size);
  return (
    <div className="container h-full  flex-grow w-full overflow-y-scroll ">
      {
        //@ts-ignore
        <Terminal
          className="bg-[rgb(23,23,23)] px-2 py-4 z-[1000]  h-full  w-full text-white  "
          prompt={`$`}
          welcomeMessage={
            <div className="flex flex-row gap-2 items-center">
              <MdOutlineTerminal size={"23px"} />
              <p>Command Prompt</p>
            </div>
          }
          onChange={(event) => {
            console.log(event);
          }}
          pt={{
            root: "bg-[rgb(23,23,23)] text-white border-round h-full",
            prompt: `text-gray-400 mr-2 ${getSize(size+1)}`,
            command: `text-primary-300 ${getSize(size+1)}`,
            response: `text-primary-300 ${getSize(size+1)}`,

          }}
        >
          {terminalLineData}
        </Terminal>
      }
    </div>
  );
};

export default TerminalController;
