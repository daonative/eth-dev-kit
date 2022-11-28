import { Interface } from "ethers/lib/utils";
import { ContractFunctionForm } from "./ContractFunctionForm";

export function ContractFunctions({ contractABI, contractAddress, chainId }: any) {
  const contractIface = new Interface(contractABI);
  const functions = Object.entries(contractIface.functions);
  return (
    <>
      {functions.map(([key, fn]) => (
        <ContractFunctionForm
          key={key}
          contractFunction={contractIface.getFunction(fn.name)}
          chainId={chainId}
          contractAddress={contractAddress} />
      ))}
    </>
  );
}
