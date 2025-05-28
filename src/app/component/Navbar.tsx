"use client";

import React, { useState, useEffect, useRef } from "react";
import { userNavigation } from "@/static/static_data";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Text from "@/components/ui/Texts/Text";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { BsDatabaseCheck } from "react-icons/bs";
import CreditsPopup from "./CreditsPopup";
import { fetchCreditBalance } from "@/lib/features/credits/creditsSlice";

interface NavbarProps {
  centerContent?: React.ReactNode; // Optional prop for center content (e.g., workspace name)
}

const Navbar: React.FC<NavbarProps> = ({ centerContent }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle the menu
  const menuRef = useRef<HTMLDivElement>(null); // Ref to track the menu DOM
  const { balance : credits } = useSelector((state: RootState) => state.credits);
  const [creditPopupOpen, setCreditPopupOpen] = useState(false);
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const dispatch = useDispatch<AppDispatch>();

  const togglePopup = () => {
    setCreditPopupOpen((prev) => !prev);
  };

  // Handles logout action
  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  // Handles menu item click, with default action for "logout"
  const handleClick = (section: string) => {
    if (section === "logout") {
      logout();
    }
    setMenuOpen(false); // Close menu when a link is clicked
  };

  // Toggles the menu open/close state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Closes the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("access_token");
      if (jwtToken) {
          dispatch(fetchCreditBalance(jwtToken));
        }
  }, []);

  return (
    <div className="w-full flex flex-row items-center justify-between py-4 px-10 border-b bg-white relative z-50">
      {/* Logo */}
      <Link href={`/dashboard/${encodeURIComponent("My workspace")}`}>
        <div className="w-[140px]">
          <img src="/pollvault.svg" alt="icon" />
        </div>
      </Link>

      {/* Center Content (e.g., workspace name), if provided */}
      <div className="flex w-full justify-center">
        {centerContent && (
          <div className="flex items-center justify-center gap-2">
            <Link href={`/dashboard/${encodeURIComponent(currentWorkspace || "My workspace")}`}>
              <Text variant="body15M" extraCSS="text-textGray">
                {/* Workspace name →{" "} */}
                {currentWorkspace} →{" "}
              </Text>
            </Link>
            <Text variant="body15M" extraCSS="truncate max-w-[600px]">
              {centerContent}{" "}
            </Text>
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-4 h-full border-gray-200  px-4  sm:gap-x-6">
        {/* Menu Toggle Button for Mobile */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="h-6 bg-gray-200 lg:hidden" aria-hidden="true" />

        <div className="flex justify-end gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Credits Section */}
            <div
              className="group flex items-center justify-center gap-2 cursor-pointer p-2 rounded-md transition-all duration-200 hover:bg-blue-100"
              onClick={togglePopup}
            >
              {/* Icon */}
              <BsDatabaseCheck className="text-textGray text-lg transition-all duration-200 group-hover:text-blue-500" />

              {/* Text */}
              <Text
                variant="body15M"
                extraCSS="text-textGray whitespace-nowrap transition-all duration-200 group-hover:text-blue-500"
              >
                {credits} credits
              </Text>
            </div>

            {/* Notifications */}
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <img
                src="/images/notification.svg"
                className="w-5 h-5 max-w-none"
              />
            </button>

            {/* Separator */}
            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              aria-hidden="true"
            />

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                className="-m-1.5 flex items-center p-1.5"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full bg-orange-200 mr-4 max-w-none"
                  src="/images/person.png"
                  alt="User Avatar"
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2.5 md:w-[250px] w-[280px] origin-top-right rounded-3xl bg-white p-3 py-4 shadow-lg ring-1 ring-gray-900/5 transition-transform duration-300 ease-in-out transform flex flex-col gap-2 ${
                  menuOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 hidden"
                }`}
              >
                {userNavigation.map((item) => (
                  <div key={item.name}>
                    {item.name === "Log out" ? (
                      <button
                        className="flex w-full flex-row p-2 rounded-3xl gap-2 hover:bg-secondaryWhiteBg  px-4  leading-6"
                        onClick={() => handleClick("logout")}
                      >
                        {item.imgSrc && (
                          <div>
                            <img src={item.imgSrc} alt={item.name} />
                          </div>
                        )}
                        <Text variant="body15M">{item.name}</Text>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex flex-row p-2 rounded-3xl gap-2 hover:bg-secondaryWhiteBg  px-4  leading-6 ${
                          item.name === "Upgrade to pro" && "text-yellow-600"
                        }`}
                        onClick={() => handleClick(item.href)}
                      >
                        {item.imgSrc && (
                          <div>
                            <img src={item.imgSrc} alt={item.name} />
                          </div>
                        )}
                        <Text variant="body15M">{item.name}</Text>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Component */}
      {creditPopupOpen && <CreditsPopup onClose={togglePopup} />}
    </div>
  );
};

export default Navbar;
