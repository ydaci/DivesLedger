'use client';
import { useState, useEffect } from "react";

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import AddDive from "@/components/shared/AddDive";
import AddCertification from "@/components/shared/AddCertification";
import ValidateDive from "./ValidateDive";
import GetDives from "@/components/shared/GetDives";
import GetCertifications  from "@/components/shared/GetCertifications";

const Main = () => {


    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
     mutation: {

          }
     })

     const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
     useWaitForTransactionReceipt({
         hash
     })

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

    return (
        <nav>
            <div>
                 <h3 className="mb-4 text-4xl">Certifications</h3>
                 <AddCertification />
                 <GetCertifications />
            </div>
            <br/>
            <hr class="separator" />
            <div>
                 <h3 className="mb-4 text-4xl">Dives</h3>
                 <AddDive />
                 <ValidateDive />
                 <GetDives />
            </div>
            <hr class="separator" />
            <br/>
        </nav>

    )
}

export default Main;