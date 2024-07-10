'use client';
import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { parseAbiItem } from "viem";

import { publicClient } from "@/utils/client";
// UI
import { useToast } from "../ui/use-toast";
import { RocketIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
const AddDive = () => {
    const { address } = useAccount();

    const [location, setLocation] = useState('');
    const [surname, setSurname] = useState('');
    const [firstName, setFirstname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [date, setDate] = useState('');
    const [depth, setDepth] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [events, setEvents] = useState([]);
    const today = new Date().toISOString().split('T')[0];

    const { data: hash, error, isPending: setIsPending, writeContract  } = useWriteContract();


const addDive = async () => {
    if (location === "") {
      toast({
        title: "Error",
        description: "Please add a valid location",
        className: 'bg-red-600'
      });
    }
     else if (surname === "") {
        toast({
          title: "Error",
          description: "Please add a valid surnames",
          className: 'bg-red-600'
        });
      }
      else if (firstName === "") {
          toast({
            title: "Error",
            description: "Please add a valid first names",
            className: 'bg-red-600'
          });
      }
      else if (date === "") {
      toast({
        title: "Error",
        description: "Please add a valid date",
        className: 'bg-red-600'
      });
    } else if (depth === "") {
        toast({
          title: "Error",
          description: "Please add a valid depth",
          className: 'bg-red-600'
        });
    } else if (duration === "") {
        toast({
          title: "Error",
          description: "Please add a valid duration",
          className: 'bg-red-600'
        });
    } 
     else {
      try {
        await writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'addDive',
          args: [location, surname, firstName, otherNames, new Date(date).getTime() / 1000, parseFloat(depth), parseInt(duration, 10), notes],
        });
        setLocation('');
        setSurname('');
        setFirstname('');
        setOtherNames('');
        setDate('');
        setDepth('');
        setDuration('');
        setNotes('');
      } catch (error) {
        console.error(error);
      }
    }
  };

    const { toast } = useToast();

    const { data: diveCurrentId, error: getError, isPending: getIsPending, refetch } = 
    useReadContract({
        address : contractAddress,
        abi: contractAbi,
        functionName: 'getCurrentDiveId',
        account: address,
    })

    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
    useWaitForTransactionReceipt({
        hash
    })

    const refetchPage = async() => {
      await refetch();
      //Events
      await getEvents();
    }

    const getEvents = async() => {
      // On récupère tous les events NumberChanged
      const numberChangedLog = await publicClient.getLogs({
          address: contractAddress,
          event: parseAbiItem('event DiveAdded(uint256 id, address indexed diver, string diversSurnames, string diversFirstNames, string otherDiverNames, string location, uint256 date, uint256 depth, uint256 duration, string notes)'),
          // du premier bloc (celui où j'ai déploye le smartContract)
          fromBlock: 0n,
          // jusqu'au dernier
          toBlock: 'latest' // Pas besoin valeur par défaut
      })
      // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
      setEvents(numberChangedLog.map(
          log => ({
              id: log.args.id.toString(),
              diver: log.args.diver.toString(),
              diversSurnames: log.args.diversSurnames.toString(),
              diversFirstNames: log.args.diversFirstNames.toString(),
              otherDiverNames: log.args.otherDiverNames.toString(),
              location: log.args.location.toString(),
              date: log.args.date.toString(),
              depth: log.args.depth.toString(),
              duration: log.args.duration.toString(),
              notes: log.args.notes.toString()
          })
      ))
    }
    

    useEffect(() => {
      if(isSuccess) {
          toast({
              title: "Congratulations",
              description: "The dive has been added but not validated",
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

  //Fetch the event when someone is connected
  useEffect(() => {
    const getAllEvents = async() => {
        if(address !== 'undefined') {
            await getEvents();
        }
    }
    getAllEvents()
}, [address])

    return (
        <div>
          <nav>
            <div className="grow">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">Add a dive</p>
            </div>
          </nav>
          <form className="space-y-4">
            <div>
              <label>
                Location : *
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Divers Surname : *
                <Input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Divers First name : *
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Accompanying Divers Names :
                <Input
                  type="text"
                  value={otherNames}
                  onChange={(e) => setOtherNames(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Date : *
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                  max={today}
                />
              </label>
            </div>
            <div>
              <label>
                Depth (meters) : *
                <Input
                  type="number"
                  step="0.01"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Duration (minutes) : *
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Notes :
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={addDive} disabled={setIsPending} className="bg-blue-500 text-white rounded p-2">
              Add Dive {setIsPending ? 'Loading...' : ''}
            </Button>
            {isSuccess &&
                    <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                            Dive {diveCurrentId ? parseInt(diveCurrentId) - 1 : ''} added but not validated.
                        </AlertDescription>
                        <AlertTitle>Transaction</AlertTitle>
                        <AlertDescription>
                          Transaction Hash: {hash}
                        </AlertDescription>
                      </Alert>
                }
                {errorConfirmation && (
                    <Alert>
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

export default AddDive;