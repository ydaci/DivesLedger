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
const AddCertification = ({ getEvents }) => {
    const { address } = useAccount();

    const [diver, setDiver] = useState('');
    const [certName, setCertName] = useState('');
    const [issuingOrganization, setIssuingOrganization] = useState('');
    const [issueDate, setIssueDate] = useState('');

    const { data: hash, isPending, error, writeC } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, refetch } =
      useWaitForTransactionReceipt({
        hash,
      })


const addCertification = async () => {
    if (diver === "") {
      toast({
        title: "Error",
        description: "Please add a valid address diver",
        className: 'bg-red-600'
      });
    }
    else if (diver.length !== 42) {
        toast({
          title: "Error",
          description: "Address driver should have 42 characters",
          className: 'bg-red-600'
        });
    } else if (certName === "") {
      toast({
        title: "Error",
        description: "Please add a valid certName",
        className: 'bg-red-600'
      });
    } else if (issuingOrganization === "") {
        toast({
          title: "Error",
          description: "Please add a valid issuing Organization",
          className: 'bg-red-600'
        });
    } else if (duration === "") {
        toast({
          title: "Error",
          description: "Please add a valid duration",
          className: 'bg-red-600'
        });
    } 
    else if (issueDate === "") {
        toast({
          title: "Error",
          description: "Please add valid issue Date",
          className: 'bg-red-600'
        });
    } 
     else {
      try {
        await writeContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'addCertification',
          args: [diver, certName, issuingOrganization, new Date(issueDate).getTime() / 1000],
        });
        setDiver('');
        setCertName('');
        setIssuingOrganization('');
        setIssueDate('');
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
              <p className="text-2xl font-bold text-gray-800 dark:text-white">Add a Certification</p>
            </div>
          </nav>
          <form className="space-y-4">
            <div>
              <label>
                Diver adress :
                <input
                  type="text"
                  value={diver}
                  onChange={(e) => setDiver(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Certification :
                <input
                  type="datetext"
                  value={certName}
                  onChange={(e) => certName(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Issuing organization :
                <input
                  type="text"
                  value={issuingOrganization}
                  onChange={(e) => setIssuingOrganization(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label>
                Issuing date :
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <Button onClick={addCertification} className="bg-blue-500 text-white rounded p-2">
              Add Certification
            </Button>
          </form>
          <Informations hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error} />
        </div>
      );
};

export default AddCertification;