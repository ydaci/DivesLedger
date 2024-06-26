import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <nav>
            <div className="grow" ><p className="text-2xl font-bold text-gray-800 dark:text-white">DivesLedger</p></div>
            <div>
                <ConnectButton />
            </div>
        </nav>

    )
}

export default Header;