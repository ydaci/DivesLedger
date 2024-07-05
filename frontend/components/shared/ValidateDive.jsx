'use client';
import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import Informations from "./Information";

// UI
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
const ValidateDive = ({ getEvents }) => {
    const { address } = useAccount();

    const [idDive, setIdDive] = useState('');

    const { data: hash, isPending, error, writeC } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, refetch } =
      useWaitForTransactionReceipt({
        hash,
      })


const validateDive = async () => {
    if (idDive === "") {
      toast({
        title: "Error",
        description: "Please add a valid address diver",
        className: 'bg-red-600'
      });
    } 
     else {
      try {
        await writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'validateDive',
          args: [idDive],
        });
        setIdDive('');
      } catch (error) {
        console.error(error);
      }
    }
  };

    const { toast } = useToast();

    return (
        <div>
          <nav>
            <div className="grow">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">Validate a dive</p>
            </div>
          </nav>
          <form className="space-y-4">
            <div>
              <label>
                Dive id :
                <input
                  type="text"
                  value={idDive}
                  onChange={(e) => setIdDive(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={validateDive} className="bg-blue-500 text-white rounded p-2">
              Validate Dive
            </Button>
          </form>
          <Informations hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
        </div>
      );
};

export default ValidateDive;