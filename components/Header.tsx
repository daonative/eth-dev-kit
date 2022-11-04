import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";

import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";

function Search() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm();
  const { chain } = useNetwork();

  const handleSearch = ({ contractAddress }: FieldValues) => {
    const chainId = chain?.id || "1";
    push(`/contracts/${chainId}/${contractAddress}`);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleSearch)}>
      <label htmlFor="email" className="sr-only">
        Search
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="search"
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search smart contracts"
          {...register("contractAddress")}
        />
      </div>
    </form>
  );
}

export default function Header() {
  return (
    <header className="">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">ETH Dev Kit</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=red&shade=500"
                alt=""
              />
            </Link>
            <div className="ml-10 w-[32rem] hidden lg:block">
              <Search />
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <ConnectButton showBalance={false} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center lg:hidden">
          <div className="max-w-[32rem] w-full">
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
}
