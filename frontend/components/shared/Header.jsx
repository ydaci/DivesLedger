'use client';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from 'react';
import { useAccount } from "wagmi";

import GeneralConditions from "@/components/shared/GeneralConditions";



const Header = () => {
        // Ajouter bouton avec les conditions générales
        const [isTermsChecked, setIsTermsChecked] = useState(false);
        const [showError, setShowError] = useState(false);
        const [errorMessage, setErrorMessage] = useState(false);
      
        const handleCheckboxChange = (event) => {
            setIsTermsChecked(event.target.checked);
            setShowError(false); // Réinitialiser le message d'erreur lorsque la case est cochée/décochée
          };
        
          const handleConnectButtonClick = () => {
            if (!isTermsChecked) {
              setShowError(true);
              setErrorMessage("Veuillez cliquer sur les conditions générales !");
            }
            setErrorMessage("Connexion ok");
          };
          
    return (
        <>
        <div className="grow" ><p className="text-2xl font-bold text-gray-800 dark:text-white">DivesLedger</p></div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isTermsChecked}
                  onChange={handleCheckboxChange}
                />

              </label>
            <GeneralConditions />
            {showError && !isTermsChecked && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          )}
          <div>
            <button onClick={handleConnectButtonClick} disabled={!isTermsChecked}>
              <ConnectButton />
            </button>
          </div>
          {showError && isTermsChecked && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          )}
          </div>
        </>
)};

export default Header;