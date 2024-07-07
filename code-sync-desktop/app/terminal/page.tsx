"use client";
import React, { useEffect, useState } from "react";
import { Terminal } from "primereact/terminal";
import { TerminalService } from "primereact/terminalservice";
import { invoke } from "@tauri-apps/api/tauri";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useFileStore } from "@/store";
var id = -1;
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
          if (event.payload.output) {
            TerminalService.emit(
              "response",
              <div>
                <p
                  className={`${event.payload.stderr && "text-red-800"}`}
                >{`$ ${event.payload.output as string} \n`}</p>
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
    TerminalService.on("command", handleTerminalInput);

    return () => {
      TerminalService.off("command", handleTerminalInput);
    };
  }, []);

  return (
    <div className="container h-full flex-grow w-full">
      <Terminal
        className="bg-[rgb(23,23,23)]  h-full  w-full text-white"
        prompt={`[${cwd}] $`}
        welcomeMessage="command Prompt"
        onChange={(event) => {
          console.log(event);
        }}
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
};

export default TerminalController;
