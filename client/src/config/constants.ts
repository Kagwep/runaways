import { RpcProvider, constants } from "starknet";

export const HelloWorld = "0x059b09f4eaa6d49a4e4914060ea226ceb8b9ae0608d49d24d68789fef65bf4bd";


export const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
  chainId: constants.StarknetChainId.SN_SEPOLIA,
});

export const ARGENT_SESSION_SERVICE_BASE_URL =
  import.meta.env.VITE_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL || "https://cloud.argent-api.com/v1";

export const ARGENT_WEBWALLET_URL = import.meta.env.VITE_PUBLIC_ARGENT_WEBWALLET_URL || "https://web.argent.xyz";
