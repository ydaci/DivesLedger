'use client';
import NotConnected from "@/components/shared/NotConnected";
//import Projet3Main from "@/components/shared/Projet3Main";

import { useAccount } from "wagmi";

export default function Home() {
  const {isConnected} = useAccount();
  return (
   <>
    {isConnected ? (
      <p>Success</p>
      ) :
      <NotConnected />
   }
   </>
  );
}