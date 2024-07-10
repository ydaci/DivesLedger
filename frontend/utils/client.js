import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";

const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

export const publicClient = createPublicClient({
    //chain: hardhat,
    chain: sepolia,
    //transport: http(),
    transport: http(RPC),
})