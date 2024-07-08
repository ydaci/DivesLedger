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
const GetCertifications = ({ getEvents }) => {
    const { address } = useAccount();
    const [addressDiver, setAddressDiver] = useState('');
    const [certifications, setCertifications] = useState(null);

    const { data: hash, isPending, error, writeContract } = useWriteContract();

      const getCertifications = async () => {
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
              functionName: 'getCertifications',
              args: [addressDiver]
            });
            setAddressDiver('');
          } catch (error) {
            console.error(error);
          }
        }
      };

      const { data: certificationDiver, error: getError, isPending: getIsPending, refetch } = 
      useReadContract({
          address : contractAddress,
          abi: contractAbi,
          functionName: 'getCertifications',
          args: [addressDiver]
      })

      useEffect(() => {
        if (certificationDiver) {
              // Convertir les BigInt en chaînes de caractères
            const formattedCertificationDiver = certificationDiver.map(certification => ({
                  ...certification,
                certLevel: certification.certLevel.toString(),
                certName:certification.certName.toString(),
                issuingOrganization:certification.issuingOrganization.toString(),
                issueDate:certification.issueDate ? new Date(Number(certification.issueDate) * 1000).toLocaleDateString('en-GB') : null
             }));
            setCertifications(formattedCertificationDiver);
        }
      }, [certificationDiver]);

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
                description: "The certification has been identified",
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
            <Button onClick={getCertifications} className="bg-blue-500 text-white rounded p-2">
              Get Diver certifications
            </Button>
        </form>
        {isSuccess && certifications && (
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Certifications got.
            <ul>
        {certifications.map((certification, index) => (
          <li key={index}>
                  {certification.certLevel && <p>Diver level : {certification.certLevel}</p>}
                  {certification.certName && <p>Diver Certification : {certification.certName}</p>}
                  {certification.issuingOrganization && <p>Certification Issuing organization: {certification.issuingOrganization}</p>}
                  {certification.issueDate && <p>Certification issue Date : {certification.issueDate}</p>}
          </li>
        ))}
      </ul>
          </AlertDescription>
        </Alert>
      )}
      {getError && (
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(getError?.shortMessage) || getError.message}
          </AlertDescription>
        </Alert>
      )}
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

export default GetCertifications;