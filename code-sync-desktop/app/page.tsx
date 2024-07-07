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
          {`The ultimate desktop editor for seamless collaborative coding. Experience real-time editing, instant synchronization, and elevate your coding projects with effortless teamwork.`}
        </p>
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
