import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";

const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

const useHardhat = true;

const chain = useHardhat ? hardhat : sepolia;
const transport = RPC ? http(RPC) : http();

export const publicClient = createPublicClient({
    chain: chain,
    transport: transport,
});