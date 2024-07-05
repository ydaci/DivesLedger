'use client';
import NotConnected from "@/components/shared/NotConnected";
import Main from "@/components/shared/Main";

import { useState } from 'react';
import { useAccount } from "wagmi";

export default function Home() {
  const {isConnected} = useAccount();
  return (
    <>
      {isConnected ? (
        <Main />
      )  :
      <NotConnected />
     }
     </>
    );
}