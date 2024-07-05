'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from 'react';
import GeneralConditions from "@/components/shared/GeneralConditions";

const Header = () => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxChange = (event) => {
    setIsTermsChecked(event.target.checked);
    setShowError(false); // Réinitialiser le message d'erreur lorsque la case est cochée/décochée
  };

  const handleConnectButtonClick = () => {
    if (!isTermsChecked) {
      setShowError(true);
      setErrorMessage("Veuillez accepter les conditions générales !");
    } else {
      setErrorMessage("Connexion réussie !");
      // Autre logique de connexion ici si nécessaire
    }
  };

  return (
    <>
      <div className="grow">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">DivesLedger</p>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isTermsChecked}
            onChange={handleCheckboxChange}
          />
         <GeneralConditions />
        </label>
        
        {showError && (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        <div>
          <ConnectButton label="Connect to DivesLedger" disabled={!isTermsChecked}
            onClick={handleConnectButtonClick} />
        </div>
      </div>
    </>
  );
};

export default Header;
