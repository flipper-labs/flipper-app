import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Profile from "./../public/svgs/profile.svg";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const navLinks = (
    <>
      <li>
        <div className="flex flex-row gap-2 align-center justify-center px-8 py-2 rounded-lg bg-violet-900">
          <Profile stroke="#fff" />
          <Link href="/profile">Profile</Link>
        </div>
      </li>
    </>
  );

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <button
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </button>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-4 ml-4 mr-6">
          <div className="flex relative w-10 h-10">
            <Image alt="Flipper logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight text-2xl">Flipper</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        {/* <FaucetButton /> */}
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>
    </div>
  );
};
