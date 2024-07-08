import Select from "@/components/Select";
import Image from "next/image";
export default function Home() {
  return (
    <main className="flex-grow h-full flex flex-row  justify-center gap-20  pl-10 items-center  bg-[rgb(23,23,23)]">
      <div>
        <div>
          <div className="flex flex-row items-center  gap-4">
            <div className="h-0.5 w-32 max-sm:w-24 bg-orange-300" />
            <h1 className="text-md font-[500] text-green-400">
              Welcome to CodeSync
            </h1>
          </div>
          <h2 className="text-6xl mt-4  max-sm:text-4xl w-96 max-sm:w-fit font-[600]   text-gray-500">
            Lets Start{" "}
          </h2>
        </div>
        <p className="mt-8 max-sm:w-fit   w-[420px] max-lg:w-full text-sm leading-relaxed font-semibold text-gray-500 ">
          {`The ultimate editor for seamless collaborative coding. Experience real-time editing, instant synchronization, and elevate your coding projects with effortless teamwork.`}
        </p>
        
        <p className="mt-8 max-sm:w-fit   w-[420px] max-lg:w-full text-sm leading-relaxed font-semibold text-[rgb(56,91,172)] ">
          This web version is used to connect to the desktop version of CodeSync. 
          Please download the desktop version from the link below and connect to it using the remote user id.
        </p>
        <div className="my-4">
          <a
            href=""
            className="text-sm font-semibold text-green-400 hover:text-green-500"
          >
            Download Desktop Version
          </a>
        </div>
        <div>
          <Select />
        </div>
      </div>
      <div className="max-lg:hidden ">
        <img alt="text-editor" src="/cmp.png" />
      </div>
    </main>
  );
}
