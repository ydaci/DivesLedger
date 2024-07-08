'use client';
import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";

// UI
import { useToast } from "../ui/use-toast";
import { RocketIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
const GetDives = ({ getEvents }) => {
    const { address } = useAccount();
    const [addressDiver, setAddressDiver] = useState('');

    const { data: hash, isPending, error, writeContract } = useWriteContract();

      const getDives = async () => {
        if (addressDiver === "") {
          toast({
            title: "Error",
            description: "Please add a valid address",
            className: 'bg-red-600'
          });
        }
        else if (addressDiver.length !== 42) {
            toast({
              title: "Error",
              description: "Address should have 42 characters",
              className: 'bg-red-600'
            });
          }
         else {
          try {
            await writeContract({
              address: contractAddress,
              abi: contractAbi,
              functionName: 'getDivesByDiver',
              args: [addressDiver],
            });
            setAddressDiver('');
          } catch (error) {
            console.error(error);
          }
        }
      };

      const { toast } = useToast();

      const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
      useWaitForTransactionReceipt({
          hash
      })

      useEffect(() => {
        if(isSuccess) {
            toast({
                title: "Congratulations",
                description: "The dive has been identified",
                className: "bg-line-200"
              })
              //refetechEverything();
        }
        if(errorConfirmation) {
                toast({
                    title: errorConfirmation.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  //refetechEverything();
        }
    }, [isSuccess, errorConfirmation])

    return (
        <div>
        <nav>
            <div className="grow" ><p className="text-2xl font-bold text-gray-800 dark:text-white">Dive Log :</p></div>
        </nav>
        <form className="space-y-4">
        <div>
              <label>
                Diver Address : *
                <Input
                  type="text"
                  value={addressDiver}
                  onChange={(e) => setAddressDiver(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={getDives} className="bg-blue-500 text-white rounded p-2">
              Get Dives
            </Button>
        </form>
        {isSuccess &&
                    <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                            Dive got.
                        </AlertDescription>
                    </Alert>
                }
                {errorConfirmation && (
                    <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {(errorConfirmation?.shortMessage) || errorConfirmation.message}
                        </AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert className="mb-4 bg-red-400">
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {(error?.shortMessage) || error.message}
                        </AlertDescription>
                    </Alert>
                )}
        </div>
        

    )
}

export default GetDives;