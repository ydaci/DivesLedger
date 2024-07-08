import { RocketIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const NotConnected = ({children}) => {
    return ( 
        <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Connect your wallet to access to DivesLedger
        </AlertDescription>
      </Alert>    
    )
}

export default NotConnected;