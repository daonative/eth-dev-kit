import { Interface } from "ethers/lib/utils";
import { classNames, Icon } from "../pages/contracts/[chainId]/[contractAddress]";

export function ContractFunctionsTOC({ contractABI }: any) {
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
          aria-hidden="true" />
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
