'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from 'react';
import GeneralConditions from "@/components/shared/GeneralConditions";

const styles = {
  disabledDiv: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
};

const Header = () => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsTermsChecked(checked);
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

  useEffect(() => {
    if (isTermsChecked) {
      setShowError(false);
    }
  }, [isTermsChecked]);

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
        <div style={!isTermsChecked ? styles.disabledDiv : {}}> 
          <ConnectButton label="Connect to DivesLedger" 
            onClick={handleConnectButtonClick} />
        </div>
      </div>
    </>
  );
};

export default Header;
