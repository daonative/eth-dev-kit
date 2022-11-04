import { chains, wagmiClient } from "@/lib/wagmi";
import { Address } from "wagmi";
import { ChainID } from "./types";

export const getProvider = (chainId: ChainID) => {
  return wagmiClient.getProvider({ chainId });
};

export const getBlockExplorer = (chainId: ChainID) => {
  const chain = chains.find((chain) => chain.id === chainId);
  return chain?.blockExplorers?.default.url;
};

export const getAddressBlockExplorerLink = (
  chainId: ChainID,
  address: Address
) => {
  return `${getBlockExplorer(chainId)}/address/${address}`;
};
