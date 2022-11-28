import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Address, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { FunctionFragment } from "ethers/lib/utils";
import { Contract } from "ethers";
import { ChainID } from "@/lib/types";
import { getProvider } from "@/lib/provider";
import Badge from "@/components/Badge";
import { PrimaryButton } from "@/components/Button";
import { Label, Input } from "@/components/Input";
import { classNames } from "@/lib/utils";

export function ContractFunctionForm({
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
  const handleCallReadFn = useCallback(
    async (params: Array<string>) => {
      const contract = new Contract(
        contractAddress,
        [contractFunction],
        provider
      );
      const result = await contract[contractFunction.name](...params);
      setResult(result.toString());
    },
    [contractAddress, provider, contractFunction]
  );

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
    console.log("yo");
  }, [isReadable, handleCallReadFn, contractFunction.inputs.length]);

  return (
    <div
      className="transition duration-300 target:ease-in-out py-4 sm:py-5 px-6 target:scale-[110%] bg-white target:shadow-lg rounded-md border border-top border-gray-200 target:mt-[-70px]"
      id={contractFunction.name}
    >
      <a href={`#${contractFunction.name}`} className="block">
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
      </a>
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
          {isReadable && contractFunction.inputs.length > 0 && (
            <PrimaryButton type="submit">
              {isReadable ? "Read" : "Write"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
}
