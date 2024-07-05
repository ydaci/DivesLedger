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


const AddDive = ({ getEvents }) => {
    const { address } = useAccount();

    const [location, setLocation] = useState('');
    const [surname, setSurname] = useState('');
    const [firstName, setFirstname] = useState('');
    const [date, setDate] = useState('');
    const [depth, setDepth] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');

    const { data: hash, isPending, error, writeC } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, refetch } =
      useWaitForTransactionReceipt({
        hash,
      })


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
    else if (notes === "") {
        toast({
          title: "Error",
          description: "Please add valid notes",
          className: 'bg-red-600'
        });
    } 
     else {
      try {
        await writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'addDive',
          args: [location, new Date(date).getTime() / 1000, parseFloat(depth), parseInt(duration, 10), notes],
        });
        setLocation('');
        setSurname('');
        setFirstname('');
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
                Location:
                <input
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
                Divers Surnames :
                <input
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
                Divers First names :
                <input
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
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Depth (meters):
                <input
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
                Duration (minutes):
                <input
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
                Notes:
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={addDive} className="bg-blue-500 text-white rounded p-2">
              Add Dive
            </Button>
          </form>
          <Informations hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
        </div>
      );
};

export default AddDive;