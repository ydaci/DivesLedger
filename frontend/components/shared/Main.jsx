'use client';
import { useState, useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { RocketIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { contractAddress, contractAbi } from "@/constants";

import { useReadContract, useAccount, useWriteContract, useTransactionReceipt, useWaitForTransactionReceipt } from "wagmi";

import { parseAbiItem } from "viem";

import { publicClient } from "@/utils/client";

import AddDive from "@/components/shared/AddDive";
import AddCertification from "@/components/shared/AddCertification";
import ValidateDive from "./ValidateDive";
import GetDives from "@/components/shared/GetDives";
import Events from "@/components/shared/Events";

const Main = () => {

     const { address } = useAccount();

    const [events, setEvents] = useState([]);

    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
     mutation: {

          }
     })

     const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
     useWaitForTransactionReceipt({
         hash
     })
 
     const refetechEverything = async() => {
         await refetch();
         //Events
         await getEvents();
     }

     const getEvents = async() => {
          // On récupère tous les events NumberChanged
          const numberChangedLog = await publicClient.getLogs({
              address: contractAddress,
              event: parseAbiItem('event NumberChanged(uint oldValue, uint newValue)'),
              // du premier bloc (celui où j'ai déploye le smartContract)
              fromBlock: 0n,
              // jusqu'au dernier
              toBlock: 'latest' // Pas besoin valeur par défaut
          })
          // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
          setEvents(numberChangedLog.map(
              log => ({
                  oldValue: log.args.oldValue.toString(),
                  newValue: log.args.newValue.toString()
              })
          ))
        }

        useEffect(() => {
          if(isSuccess) {
              toast({
                  title: "Congratulations",
                  description: "Votre address has been recorded in blockchain !",
                  className: "bg-line-200"
                })
                refetechEverything();
          }
          if(errorConfirmation) {
              if(isSuccess) {
                  toast({
                      title: errorConfirmation.message,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    })
                    refetechEverything();
              }
          }
      }, [isSuccess, errorConfirmation])
  
      //Lorsque l'on a qqn qui est connecté, on fetch les events
      useEffect(() => {
          const getAllEvents = async() => {
              if(address !== 'undefined') {
                  await getEvents();
              }
          }
          getAllEvents()
      }, [address])

    return (
        <nav>
            <div>
                 <h3 className="mb-4 text-4xl">Dives</h3>
                 <AddDive />
                 <ValidateDive />
                 <p> The number in the Blockchain : </p>
                 <GetDives />
            </div>
            <br/>
            <div>
                 <h3 className="mb-4 text-4xl">Certifications</h3>
                 <AddCertification />
            </div>
            <br/>
        </nav>

    )
}

export default Main;