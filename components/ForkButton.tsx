import { ChainID } from "@/lib/types";
import Image from "next/image";
import { Address } from "wagmi";
import ForkIcon from "@/public/fork-icon.svg";

type ForkButtonProps = {
  contractAddress: Address | undefined;
  chainId: ChainID | undefined;
};

const ForkButton = ({ contractAddress, chainId }: ForkButtonProps) => {
  if (!contractAddress || !chainId) return <></>;
  if (chainId !== 1) return <></>;

  return (
    <a href={`https://remix.ethereum.org/address/${contractAddress}`} target="_blank" rel="noreferrer">
      <button
        type="button"
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-1"
      >
        <Image src={ForkIcon} alt="Fork Icon" className="w-3" />
        Fork
      </button>
    </a>
  );
};

export default ForkButton;
