"use client";

import React from "react";
import Link from "next/link";
import { FaAngleRight, FaChevronDown } from "react-icons/fa";
import Text from "@/components/ui/Texts/Text";

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  activeLink: string;
  setActiveLink: (link: string) => void;
  toogleIntro: () => void;
  toogleProfile: () => void;
  isLogIn: boolean;
}

const MobileSideMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  toggleMenu,
  activeLink,
  setActiveLink,
  toogleIntro,
  toogleProfile,
  isLogIn,
}) => {
  return (
    <div
      className={`lg:hidden absolute w-full h-svh top-0 flex z-50 transition-all ${
        menuOpen ? "left-0" : "-left-full"
      }`}
    >
      <div className="w-4/5 bg-white relative h-svh shadow-2xl p-4 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <img src="/purpleSmallLogo.svg" alt="icon" />
          </div>
          <div className="hover:scale-105 cursor-pointer" onClick={toggleMenu}>
            <img src="/images/conversation/menuIn.svg" alt="icon" />
          </div>
        </div>

        <div className="p-3 flex flex-col gap-6">
          <button
            className="flex items-center gap-3 hover:bg-gray-200 rounded-lg p-3"
            onClick={toogleIntro}
          >
            <img src="/images/conversation/introduction.svg" alt="icon" />
            <Text variant="body15R" extraCSS="text-[#452DA2]">
              Intro & instructions
            </Text>
          </button>
          <button
            className={`flex items-center gap-3 p-3 rounded-lg ${
              activeLink === "poll"
                ? "bg-gray-300 text-blue-700"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveLink("poll");
              toggleMenu();
            }}
          >
            <img src="/images/conversation/poll.svg" alt="icon" />
            <Text variant="body15R" extraCSS="text-[#452DA2]">Poll</Text>
          </button>
          <button
            className="flex items-center gap-3 hover:bg-gray-200 rounded-lg p-3"
            onClick={toogleProfile}
          >
            <img src="/images/conversation/referenceBlue.svg" alt="icon" />
            <Text variant="body15R" extraCSS="text-[#452DA2]">Reference</Text>
          </button>
        </div>

        <div className="mt-auto">
          {isLogIn ? (
            <div className="w-full bg-[#F8F8F8] p-4 rounded-xl shadow-lg flex gap-2 items-center justify-center">
              <div>
                <img
                  className="h-12 w-12 rounded-full bg-orange-200 mr-4"
                  src="/images/person.png"
                  alt="User Avatar"
                />
              </div>
              <div className="flex-1">
                <Text variant="body15SB">Adrian Taz</Text>
                <Text variant="body13M">TaZ Solutions</Text>
              </div>
              <FaChevronDown />
            </div>
          ) : (
            <Link href={"/signin"} target="_blank" className="cursor-pointer">
              <div className="p-4 relative overflow-hidden bg-[#DAA520] rounded-xl">
                <img
                  className="w-full absolute top-0 left-0 z-0"
                  src="/images/conversation/loginBg.svg"
                  alt="img"
                />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <Text variant="body15M" extraCSS="text-white">Sign in!</Text>
                  <FaAngleRight className="text-white" />
                </div>
                <Text variant="body13R" extraCSS="relative w-[90%] z-10 text-white">
                  New here? An account will be automatically created.
                </Text>
              </div>
            </Link>
          )}
        </div>

        <Text variant="body15R" extraCSS="text-[#452DA2] mb-10 text-center text-[14px]">
          By continuing, you agree to our{" "}
          <span className="font-bold">Privacy Policy</span> and{" "}
          <span className="font-bold">Terms of Service.</span>
        </Text>
      </div>

      {/* Hidden side panel to close the menu */}
      <div className="w-1/5 h-full backdrop-blur-sm" onClick={toggleMenu}></div>
    </div>
  );
};

export default MobileSideMenu;
