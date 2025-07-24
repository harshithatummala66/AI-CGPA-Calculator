"use client";

import { useState, useEffect } from "react";
import Navmenu from "../components/Base/navmenu";
import Fileuploads from "@/components/Base/fileupload";
import { Drawers } from "@/components/Base/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import "./globals.css";
import FloatingObject from "@/components/FloatingObject";
import Image from 'next/image';


// Load the backend URL from the environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const App = ({ outerfile }) => {
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(outerfile);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file to upload.");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/calculate-cgpa`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process file");
      }
      const result = await res.json();
      setResults(result);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => console.log("Backend warmed up"))
      .catch((err) => console.error("Ping failed"));
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-h-screen h-[100dvh] justify-between p-3 gap-10 bg-gradient-to-tr from-black to-zinc-800  overflow-hidden shadow-[0px_0px_50px_rgba(255,255,255,0.1)] ">
      <div className="flex flex-col gap-5 items-center w-full max-w-[1200px] min-w-[300px] max-h-[1080px] h-full ">
        <div className="flex w-full justify-between ">
          <Navmenu />
            <Image src={"/logo.svg"} width={10} height={10} alt="Logo" className="slow-spin w-7 md:w-10 " onClick={()=>location.reload()}></Image>

        </div>
        <div className="flex flex-col items-center gap-5 w-full">
          <Fileuploads setFile={setFile} />
          <FloatingObject /> <FloatingObject />
          <FloatingObject /> <FloatingObject />
          <FloatingObject /> <FloatingObject />
          <FloatingObject /> <FloatingObject />
          {results ? (
            <div className="flex flex-col gap-5 items-center">
              <h1 className="text-8xl lg:text-9xl text-transparent bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-shadow-border font-bold ">
                {results.cgpa}
              </h1>
              <div className="flex flex-col w-full  text-center font-thin text-zinc-500 ">
                👏🏻{results.student_info.Student_Name}
              </div>
            </div>
          ) : Loading ? (
            <Skeleton className="w-[9rem] h-[9rem] rounded-3xl" />
          ) : (
            <p className="relative z-20 font-thin text-zinc-400 text-sm mt-2 text-center">
              Upload only GRTIET PDF result <br />
              For concerns, Mail
              <br />
              <a
                href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                className="underline font-bold text-white"
              >
                sujith.sappani@gmail.com
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center h-full w-full">
        <div className="flex items-center justify-end gap-5 h-full w-full max-w-full sm:max-w-[400px] flex-col sm:flex-row sm:justify-center sm:items-end">
          {results != null ? <Drawers result={results} /> : ""}
          <Button
            className={`${Loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
            onClick={uploadFile}
            disabled={Loading || !file}
          >
            Upload
          </Button>
          {error && (
            <div className="mt-4 p-3 bg-red-600 text-white-700 font-bold rounded-full">
              <p>{"Upload a Valid PDF !!"}</p>
            </div>
          )}
        </div>

        <footer className="text-[10px] w-full text-center text-zinc-500 pt-3 mt-8">
          <p>&copy; {new Date().getFullYear()} AI CGPA Calculator | SSS</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
