'use client';
import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import { contractAddress, contractAbi } from "@/constants";
import { parseAbiItem } from "viem";
import { publicClient } from "@/utils/client";
// UI
import { useToast } from "../ui/use-toast";
import { RocketIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AddCertification = () => {
    const { address } = useAccount();

    const [diver, setDiver] = useState('');
    const [certLevel, setCertLevel] = useState('');
    const [issuingOrganization, setIssuingOrganization] = useState('');
    const [issueDate, setIssueDate] = useState('');
    //Display the values in the page
    const [addedCertLevel, setAddedCertLevel] = useState("");
    const [addedDiver, setAddedDiver] = useState("");
    const today = new Date().toISOString().split('T')[0];

    const [events, setEvents] = useState([]);

    const { data: certName, error: getError, isPending: getIsPending, refetch } = 
    useReadContract({
        address : contractAddress,
        abi: contractAbi,
        functionName: 'getCertificationName',
        account: address,
        args: [addedCertLevel]
    })

    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract();


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
    } else if (certLevel === "") {
      toast({
        title: "Error",
        description: "Please add a valid level",
        className: 'bg-red-600'
      });
    } else if (issuingOrganization === "") {
        toast({
          title: "Error",
          description: "Please add a valid issuing Organization",
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
    else if (issueDate > new Date()) {
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
          args: [diver, certLevel, issuingOrganization, new Date(issueDate).getTime() / 1000],
        });
        setAddedCertLevel(certLevel);
        setAddedDiver(diver);
        setDiver('');
        setCertLevel('');
        setIssuingOrganization('');
        setIssueDate('');
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

    const refetchPage = async() => {
      await refetch();
      //Events
      await getEvents();
    }

    const getEvents = async() => {
      // On récupère tous les events NumberChanged
      const certificationAddedLog = await publicClient.getLogs({
          address: contractAddress,
          event: parseAbiItem('event CertificationAdded(address indexed diver, string certName, string issuingOrganization, uint256 issueDate)'),
          // du premier bloc (celui où j'ai déploye le smartContract)
          fromBlock: 0n,
          // jusqu'au dernier
          toBlock: 'latest' // Pas besoin valeur par défaut
      })
      // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
      setEvents(certificationAddedLog.map(
          log => ({
              diver: log.args.diver.toString(),
              certName: log.args.certName.toString(),
              issuingOrganization: log.args.issuingOrganization.toString(),
              issueDate: log.args.issueDate.toString()
          })
      ))
    }

    useEffect(() => {
      if(isSuccess) {
          toast({
              title: "Congratulations",
              description: "The certification has been added",
              className: "bg-line-200"
            })
            //refetchPage();
      }
      if(errorConfirmation) {
              toast({
                  title: errorConfirmation.message,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                })
                //refetchPage();
          }
  }, [isSuccess, errorConfirmation])

      //LFetch the events
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
              <p className="text-2xl font-bold text-gray-800 dark:text-white">Add a Certification</p>
            </div>
          </nav>
          <form className="space-y-4">
            <div>
              <label>
                Diver address * :
                <Input
                  type="text"
                  value={diver}
                  onChange={(e) => setDiver(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </label>
            </div>
            <div>
              <label> Certification Level * : 
            <select
              value={certLevel}
              onChange={(e) => setCertLevel(e.target.value)}
              required
              className="border rounded p-2 w-full"
            >
          <option value="">Select a level</option>
          <option value="1">Level 1 - Diver 1 star / Open Water Diver</option>
          <option value="2">Level 2 - Diver 2 stars / Advanced Open Water Diver</option>
          <option value="3">Level 3 - Diver 3 stars / Rescue Diver</option>
          <option value="4">Level 4 - Confirmed diver / Divemaster</option>
          <option value="5">Level 5 - Instructor assistant</option>
          <option value="6">Level 6 - Instructor / Dive Leader</option>
          <option value="7">Level 7 - Instructor 2 stars</option>
          <option value="8">Level 8 - Instructor 3 stars</option>
          <option value="9">Level 9 - Instructor 4 stars</option>
          <option value="10">Level 10 - Instructor 5 stars</option>
          </select>
          </label>
          </div>
            <div>
              <label>
                Issuing organization * :
                <Input
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
                Issuing date * :
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                  max={today} 
                />
              </label>
            </div>
            <Button onClick={addCertification} disabled={setIsPending}  className="bg-blue-500 text-white rounded p-2">
              Add Certification {setIsPending ? 'Loading...' : ''}
            </Button>
            {isConfirming && 
                <Alert>
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Waiting for confirmation...
                    </AlertDescription>
                </Alert>
                }
            {isSuccess && 
                <Alert>
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                        Certification added. {addedDiver} got a new certification : {addedCertLevel} - {certName}
                    </AlertDescription>
                    <br/>
                    <AlertTitle>Transaction</AlertTitle>
                    <AlertDescription>
                        Transaction Hash: {hash}
                    </AlertDescription>
                </Alert>
                }
                {errorConfirmation && (
                <Alert>
                    <RocketIcon className = "mb-4 bg-red-400" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {(errorConfirmation).shortMessage || errorConfirmation.message}
                    </AlertDescription>
                </Alert>
                )}
                {error && (
                <Alert className = "mb-4 bg-red-400">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {(error).shortMessage || error.message}
                    </AlertDescription>
                </Alert>
                )}
          </form>
        </div>
      );
};

export default AddCertification;