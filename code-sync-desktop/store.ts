import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useFileStore = create(
  persist(
    (set) => ({
      directoryPath: "",
      activeFile: "",
      openFiles: [],
      fileData: {},
      selectedFile: "",

      remotedirectoryPath: "",
      remoteactiveFile: "",
      remoteopenFiles: [],
      remotefileData: {},
      size: 0,
      increaceSize: () =>
        set((state: any) => ({ size: Math.min(state.size + 1, 4) })),
      decreaseSize: () =>
        set((state: any) => ({ size: Math.max(0, state.size - 1) })),
      remoteId: "",
      userId: "",
      Mode: "",
      setDirectoryPath: (value: string) =>
        set(() => ({ directoryPath: value })),
      setActiveFile: (value: string) => set(() => ({ activeFile: value })),
      setMode: (value: string) => set(() => ({ Mode: value })),
      setOpenFiles: (value: string[]) => set(() => ({ openFiles: value })),
      addOpenFile: (value: string) =>
        set((state: any) => {
          for (let file of state.openFiles) {
            if (file === value) return state;
          }
          return { openFiles: [...state.openFiles, value] };
        }),
      removeOpenFile: (value: string) =>
        set((state: any) => ({
          openFiles: state.openFiles.filter((file: any) => file != value),
        })),
      remotesetDirectoryPath: (value: string) =>
        set(() => ({ remotedirectoryPath: value })),
      remotesetActiveFile: (value: string) =>
        set(() => ({ remoteactiveFile: value })),
      remotesetOpenFiles: (value: string[]) =>
        set(() => ({ remoteopenFiles: value })),
      remoteaddOpenFile: (value: string) =>
        set((state: any) => {
          for (let file of state.remoteopenFiles) {
            if (file === value) return state;
          }
          return { remoteopenFiles: [...state.remoteopenFiles, value] };
        }),
      remoteremoveOpenFile: (value: string) =>
        set((state: any) => ({
          remoteopenFiles: state.remoteopenFiles.filter(
            (file: any) => file != value
          ),
        })),
      reset: () =>
        set(() => ({ directoryPath: "", activeFile: "", openFiles: [] })),
      setRemoteId: (value: string) => set(() => ({ remoteId: value })),
      setUserId: (value: string) => set(() => ({ userId: value })),
      setFileData: (key: string, value: any) =>
        set((state: any) => {
          if (value === undefined) return { fileData: { ...state.fileData } };
          return { fileData: { ...state.fileData, [key]: value } };
        }),
      remotesetFileData: (key: string, value: any) =>
        set((state: any) => {
          if (value === undefined)
            return { remotefileData: { ...state.remotefileData } };
          return { remotefileData: { ...state.remotefileData, [key]: value } };
        }),
      setSelectedFile: (value: string) => set(() => ({ selectedFile: value })),
    }),
    {
      name: "file-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage instead of localStorage
    }
  )
);
