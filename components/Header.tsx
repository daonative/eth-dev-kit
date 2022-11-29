import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Search from "./Search";

export default function Header() {
  return (
    <header className="">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 sticky "
        aria-label="Top"
      >
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
            <div className="ml-10 w-[32rem] ">
              <Search />
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>
    </header>
  );
}
