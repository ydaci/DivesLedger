'use client';
import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { parseAbiItem } from "viem";
import { publicClient } from "@/utils/client";

// UI
import { useToast } from "../ui/use-toast";
import { RocketIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const ValidateDive = () => {
    const { address } = useAccount();
    const [diver, setDiver] = useState('');

    const [idDive, setIdDive] = useState('');

    const { data: hash, error, isPending: setIsPending, writeContract  } = useWriteContract();

    const [events, setEvents] = useState([]);


const validateDive = async () => {
    if (idDive === "") {
      toast({
        title: "Error",
        description: "Please add an valid dive id",
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

    const { isLoading: isConfirming, isSuccess, error: errorConfirmation, refetch  } =
    useWaitForTransactionReceipt({
        hash
    })

    const getEvents = async() => {
      const diveValidatedLog = await publicClient.getLogs({
          address: contractAddress,
          event: parseAbiItem('event DiveValidated(uint256 id, address indexed instructor)'),
          fromBlock: 0n,
          toBlock: 'latest'
      })
      // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
      setEvents(diveValidatedLog.map(
          log => ({
              id: log.args.id.toString(),
              diver: address.toString()
          })
      ))
    }

    const refetchPage = async() => {
      await refetch();
      //Events
      await getEvents();
    }

    useEffect(() => {
      if(isSuccess) {
          toast({
              title: "Congratulations",
              description: "The dive has been validated",
              className: "bg-line-200"
            })
            refetchPage();
      }
      if(errorConfirmation) {
              toast({
                  title: errorConfirmation.message,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                })
                refetchPage();
      }
  }, [isSuccess, errorConfirmation])


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
                <Input
                  type="text"
                  value={idDive}
                  onChange={(e) => setIdDive(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={validateDive} disabled={setIsPending} className="bg-blue-500 text-white rounded p-2">
              Validate Dive {setIsPending ? 'Loading...' : ''}
            </Button>
            {hash && 
                <Alert className = "mb-4 bg-green-400">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Transaction Hash: {hash}
                    </AlertDescription>
                </Alert>
              }
            {isConfirming && 
                <Alert className = "mb-4 bg-green-400">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Waiting for confirmation...
                    </AlertDescription>
                </Alert>
              }
            {isSuccess &&
                    <Alert className = "mb-4 bg-green-400">
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                            Dive validated.
                        </AlertDescription>
                        <AlertDescription>
                          Transaction Hash: {hash}
                        </AlertDescription>
                    </Alert>
                }
                {errorConfirmation && (
                    <Alert className="mb-4 bg-red-400">
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {(errorConfirmation.shortMessage) || errorConfirmation.message}
                        </AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert className="mb-4 bg-red-400">
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {(error.shortMessage) || error.message}
                        </AlertDescription>
                    </Alert>
                )}
          </form>
        </div>
      );
};

export default ValidateDive;