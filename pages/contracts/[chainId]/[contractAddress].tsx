import { useRouter } from "next/router";

import { Address } from "wagmi";

import { ContractDetails as IContractDetails, ChainID } from "@/lib/types";

import Header from "@/components/Header";
import { ContractDetails } from "../../../components/ContractDetails";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const Icon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={classNames("w-6 h-6", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
    />
  </svg>
);

export default function ContractPage() {
  const {
    query: { contractAddress: contractAddressString, chainId: chainIdString },
  } = useRouter();
  const chainId = Number(chainIdString) as ChainID;
  const contractAddress = contractAddressString as Address;

  return (
    <>
      <Header />
         <ContractDetails
            contractAddress={contractAddress}
            chainId={chainId}
          />
    </>
  );
}
