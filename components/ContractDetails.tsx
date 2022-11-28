import { useEffect, useState } from "react";
import { Address } from "wagmi";
import { getContractDetails } from "@/lib/contracts";
import { ContractDetails, ChainID } from "@/lib/types";
import ForkButton from "@/components/ForkButton";
import { ContractFunctionsTOC } from "./ContractFunctionsTOC";
import { ContractFunctions } from "./ContractFunctions";

export function ContractDetails({
  contractAddress,
  chainId,
}: {
  contractAddress: Address | undefined;
  chainId: ChainID | undefined;
}): JSX.Element {
  const [contractDetails, setContractDetails] =
    useState<ContractDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contractAddress || !chainId) return;
    const retrieveContractDetails = async () => {
      setIsLoading(true);
      const details = await getContractDetails(chainId, contractAddress);
      setContractDetails(details);
      setIsLoading(false);
    };
    retrieveContractDetails();
  }, [contractAddress, chainId]);

  if (!isLoading && !contractDetails) return <>UnkownContract</>;

  return (
    <div className="flex gap-6 lg:w-4/5 m-auto ">
      <aside className="sticky h-screen top-0 bg-gray-50 px-2">
        <ContractFunctionsTOC contractABI={contractDetails?.ABI || []} />
      </aside>
      <main className="shadow sm:rounded-lg w-full ">
        <div className="px-4 py-5 sm:px-6 flex justify-between bg-white rounded-md">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {contractDetails?.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {contractAddress}
            </p>
          </div>
          <div>
            <ForkButton contractAddress={contractAddress} chainId={chainId} />
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="">
            <ContractFunctions
              contractABI={contractDetails?.ABI || []}
              contractAddress={contractAddress}
              chainId={chainId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
