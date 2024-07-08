'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from 'react';
import GeneralConditions from "@/components/shared/GeneralConditions";

const Header = () => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxChange = (event) => {
    setIsTermsChecked(event.target.checked);
    setShowError(false); 
  };

  const handleConnectButtonClick = () => {
    if (!isTermsChecked) {
      setShowError(true);
      setErrorMessage("You must accept the general conditions !");
    } else {
      setIsConnected(true);
      setErrorMessage("Connection ok !");
    }
  };

  return (
    <>
      <div className="grow">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">DivesLedger</p>
      </div>
      <div>
      {!isConnected && (
        <label>
          <input
            type="checkbox"
            checked={isTermsChecked}
            onChange={handleCheckboxChange}
          />
         <GeneralConditions />
        </label>
      )}
        
        {showError && (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        <div>
        {isTermsChecked && (
          <ConnectButton label="Connect to DivesLedger" disabled={!isTermsChecked}
            onClick={handleConnectButtonClick} />
        )}
        </div>
      </div>
    </>
  );
};

export default Header;
