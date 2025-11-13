"use client";
import { useRouter } from "next/navigation";
import StartPage from "./startPage/startPage"; 

export default function Home() {
  const router = useRouter();

  return <StartPage />;
}



