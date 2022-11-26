import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Address, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { FunctionFragment, Interface } from "ethers/lib/utils";
import { Contract } from "ethers";

import { getContractDetails } from "@/lib/contracts";
import { ContractDetails, ChainID } from "@/lib/types";
import { getProvider } from "@/lib/provider";

import Header from "@/components/Header";
import Badge from "@/components/Badge";
import ForkButton from "@/components/ForkButton";
import { PrimaryButton } from "@/components/Button";
import { Label, Input } from "@/components/Input";

function ContractFunctionForm({
  contractAddress,
  chainId,
  contractFunction,
}: {
  contractAddress: Address;
  chainId: ChainID;
  contractFunction: FunctionFragment;
}) {
  const [result, setResult] = useState(null);
  const { register, handleSubmit } = useForm();
  const addRecentTransaction = useAddRecentTransaction();

  const provider = getProvider(chainId);
  const { data: signer } = useSigner();
  const name = contractFunction.name;
  const outputs = contractFunction.outputs
    ?.map((output) => output.type)
    .join(",");
  const isReadable = contractFunction.constant;
  const isPayable = contractFunction.payable;

  const handleCallReadFn = async (params: Array<string>) => {
    const contract = new Contract(
      contractAddress,
      [contractFunction],
      provider
    );
    const result = await contract[contractFunction.name](...params);
    setResult(result.toString());
  };

  const handleCallWriteFn = async (params: Array<string>) => {
    if (!signer) return;
    if ((await signer.getChainId()) !== chainId) return;

    const contract = new Contract(contractAddress, [contractFunction], signer);
    const tx = await contract[contractFunction.name](...params);
    addRecentTransaction({ hash: tx.hash, description: contractFunction.name });
    await tx.wait();
  };

  const handleCallFn = async (data: FieldValues) => {
    const params: Array<string> = [];
    Object.keys(data).forEach((key) => {
      params[key as unknown as number] = data[key];
    });

    if (isReadable) handleCallReadFn(params);
    else handleCallWriteFn(params);
  };
  useEffect(() => {
    if (!isReadable) return;
    if (contractFunction.inputs.length !== 0) return;
    handleCallReadFn([]);
  }, [isReadable, handleCallReadFn, contractFunction.inputs.length]);

  return (
    <div className="py-4 sm:py-5 sm:px-6" id={contractFunction.name}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">
          {name} {outputs && <>({outputs})</>}
        </h3>
        <div className="flex gap-2">
          {isReadable ? (
            <Badge className="bg-green-100">Read</Badge>
          ) : (
            <Badge className="bg-red-100">Write</Badge>
          )}
          {isPayable && <Badge className="bg-green-100">Read</Badge>}
        </div>
      </div>
      <form onSubmit={handleSubmit(handleCallFn)}>
        <div className="py-3 flex flex-col gap-2">
          {contractFunction.inputs.map((input, index) => {
            const key = `${contractFunction.name}_${index}`;
            const name = input.name || "<input>";
            const label = `${name} (${input.type})`;
            return (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  placeholder={label}
                  autoComplete="off"
                  {...register(String(index), { required: true })}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center">
          <div>{result}</div>
          {isReadable && contractFunction.inputs.length > 1 && (
            <PrimaryButton type="submit">
              {isReadable ? "Read" : "Write"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
}
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const Icon = ({ className }: { className: string }) => (
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

function ContractFunctionsTOC({ contractABI }: any) {
  const contractIface = new Interface(contractABI);
  const functions = Object.entries(contractIface.functions);
  return (
    <ul>
      <a
        className={classNames(
          "text-gray-900",
          "group flex items-center py-2 text-sm font-medium rounded-md"
        )}
      >
        <Icon
          className={classNames("flex-shrink-0 mr-3 h-6 w-6")}
          aria-hidden="true"
        />
        <span className="truncate">{"Functions"}</span>
      </a>
      {functions.map(([key, fn]) => (
        <li
          key={key}
          className="list-disc ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 "
        >
          <a href={`#${fn.name}`} className="">
            {fn.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContractFunctions({ contractABI, contractAddress, chainId }: any) {
  const contractIface = new Interface(contractABI);
  const functions = Object.entries(contractIface.functions);
  return (
    <>
      {functions.map(([key, fn]) => (
        <ContractFunctionForm
          key={key}
          contractFunction={contractIface.getFunction(fn.name)}
          chainId={chainId}
          contractAddress={contractAddress}
        />
      ))}
    </>
  );
}

function ContractDetails({
  contractAddress,
  chainId,
}: {
  contractAddress: Address | undefined;
  chainId: ChainID | undefined;
}) {
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
    <div className="flex gap-6 lg:w-4/5 m-auto">
      <aside className="sticky h-screen top-0">
        <ContractFunctionsTOC contractABI={contractDetails?.ABI || []} />
      </aside>
      <main className="overflow-hidden bg-white shadow sm:rounded-lg w-full ">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
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
          <div className="sm:divide-y sm:divide-gray-200">
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

export default function ContractPage() {
  const {
    query: { contractAddress: contractAddressString, chainId: chainIdString },
  } = useRouter();
  const chainId = Number(chainIdString) as ChainID;
  const contractAddress = contractAddressString as Address;

  return (
    <>
      <Header />
      <ContractDetails contractAddress={contractAddress} chainId={chainId} />
    </>
  );
}
