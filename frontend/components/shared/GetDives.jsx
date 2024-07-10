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
    const [dives, setDives] = useState(null);

    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract();

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
              args: [addressDiver]
            });
            setAddressDiver('');
          } catch (error) {
            console.error(error);
          }
        }
      };

      const { data: diverLog, error: getError, isPending: getIsPending, refetch } = 
      useReadContract({
          address : contractAddress,
          abi: contractAbi,
          functionName: 'getDivesByDiver',
          args: [addressDiver]
      })

      useEffect(() => {
        if (diverLog) {
              // Convertir les BigInt en chaînes de caractères
            const formattedDiverLog = diverLog.map(dive => ({
                  ...dive,
                id: dive.id.toString(),
                diver:dive.diver.toString(),
                diverSurname:dive.diverSurname.toString(),
                diverFirstName:dive.diverFirstName.toString(),
                otherDiverNames:dive.otherDiverNames.toString(),
                location:dive.location.toString(),
                date:dive.date  ? new Date(Number(dive.date) * 1000).toLocaleDateString('en-GB') : null,
                depth: dive.depth.toString(),
                duration: dive.duration.toString(),
                notes: dive.notes.toString(),
                validated: dive.validated.toString()
            }));
          setDives(formattedDiverLog);
        }
      }, [diverLog]);

      const { toast } = useToast();

      const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
      useWaitForTransactionReceipt({
          hash
      })

      const refetchPage = async() => {
        await refetch();
    }

      useEffect(() => {
        if(isSuccess) {
            toast({
                title: "Congratulations",
                description: "The dive has been identified",
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
            <Button onClick={getDives} disabled={setIsPending} className="bg-blue-500 text-white rounded p-2">
              Get Dive Log {setIsPending ? 'Loading...' : ''}
            </Button>
        </form>
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
        {isSuccess && dives && (
        <Alert className = "mb-4 bg-green-400">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Dives got.
            {dives.length === 0 ? (
                <p>0 dive for this diver</p>
                  ) : (
              <ul>
              {dives.map((dive, index) => (
                <li key={index}>
                      {dive.id && <p>Dive id : {dive.id}</p>}
                      {dive.diver && <p>Diver: {dive.diver}</p>}
                      {dive.diverSurname && <p>Diver Surname: {dive.diverSurname}</p>}
                      {dive.diverFirstName && <p>Diver First Name: {dive.diverFirstName}</p>}
                      {dive.otherDiverNames && <p>Accompany divers names: {dive.otherDiverNames}</p>}
                      {dive.location && <p>Location: {dive.location}</p>}
                      {dive.date && <p>Date: {dive.date}</p>}
                      {dive.depth && <p>Depth: {dive.depth}</p>}
                      {dive.duration && <p>Duration: {dive.duration}</p>}
                      {dive.notes && <p>Notes: {dive.notes}</p>}
                      {dive.validated && <p>Validated: {dive.validated}</p>}
                  </li>
                ))}
            </ul>
        )}
          </AlertDescription>
        </Alert>
      )}
                      {errorConfirmation && (
                    <Alert className="mb-4 bg-red-400">
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