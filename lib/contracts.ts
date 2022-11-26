import axios from "axios";
import { Address } from "wagmi";
import { ChainID } from "./types";

const ETHERSCAN_CONFIG = {
  1: {
    domain: "api.etherscan.io",
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_MAINNET_API_KEY,
  },
  5: {
    domain: "api-goerli.etherscan.io",
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_GOERLI_API_KEY,
  },
};

export async function getContractDetails(
  chainId: ChainID,
  contractAddress: Address
) {
  const { domain, apiKey } = ETHERSCAN_CONFIG[chainId];
  const url = `https://${domain}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  const result = await axios.get(url);

  if (result.data.message === "NOTOK") return null;

  const contractDetails = result.data.result?.[0];

  if (!contractDetails) return null;

  const { SourceCode, ABI, ContractName } = contractDetails;
  return {
    sourceCode: SourceCode,
    ABI: JSON.parse(ABI),
    name: ContractName,
  };
}
