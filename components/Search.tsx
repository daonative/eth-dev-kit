import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { chainId } from "wagmi";

export default function Search() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm();

  const handleSearch = ({ chainId, contractAddress }: FieldValues) => {
    push(`/contracts/${chainId}/${contractAddress}`);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleSearch)}>
      <label
        htmlFor="phone-number"
        className="block text-sm font-medium text-gray-700"
      ></label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="country" className="sr-only">
            Country
          </label>
          <select
            className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            {...register("chainId")}
          >
            <option value={1}>Ethereum</option>
            <option value={137}>Polygon</option>
            <option value={137}>Gnosis</option>
          </select>
        </div>
        <input
          type="search"
          className="block w-full rounded-md border-gray-300 pl-28 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search smart contracts"
          {...register("contractAddress")}
        />
      </div>
    </form>
  );
}
