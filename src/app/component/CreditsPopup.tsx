"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import to fetch state from Redux
import { AiOutlineClose } from "react-icons/ai";
import { BsDatabaseCheck } from "react-icons/bs";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { usePathname, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCreditBalance } from "@/lib/features/credits/creditsSlice";

interface CreditsPopupProps {
  onClose: () => void;
}

const CreditsPopup: React.FC<CreditsPopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"unlimited" | "refer">(
    "unlimited"
  );
  const popupRef = useRef<HTMLDivElement>(null);
  const jwtToken = localStorage.getItem("access_token");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch credits from Redux store
  const { balance, loading: creditsLoading } = useSelector((state: RootState) => state.credits);
  
  const refreshCredits = () => {
    if (jwtToken) {
      dispatch(fetchCreditBalance(jwtToken));
    }
  };

  // Close popup when clicking outside the box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose(); // Trigger onClose when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

   // ⏱️ Auto-fetch on mount
  useEffect(() => {
    refreshCredits();
  }, [jwtToken]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white w-[90%] max-w-[500px] p-8 rounded-xl shadow-lg relative animate-fadeIn"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-all duration-200"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <Text variant="h2" extraCSS="text-gray-800">
            Your Account Balance
          </Text>
          <div className="flex items-center justify-center gap-3 mt-1">
            <BsDatabaseCheck className="text-primaryBlue text-2xl" />
            <Text variant="h2" extraCSS="text-primaryBlue">
              {balance} credits
            </Text>
            <div className={`cursor-pointer hover:opacity-70 transition-all duration-200 ${creditsLoading && 'animate-spin'}`}  
              onClick={refreshCredits}
              title="Refresh balance"
            >
              <img
                src="/images/results/refresh.svg"
                width={24}
                height={24}
                alt="image"
              />
            </div>
          </div>
          <Text variant="body15R" extraCSS="text-gray-500 mt-2">
            Credits let you create and edit with AI. Each user in your workspace
            gets their own credits.
          </Text>
        </div>

        {/* Tabs for Toggle */}
        <div className="flex space-x-4 border-b pb-3 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "unlimited"
                ? "text-primaryBlue bg-blue-100"
                : "text-gray-500 hover:text-primaryBlue hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("unlimited")}
          >
            Get Unlimited Credits
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "refer"
                ? "text-primaryBlue bg-blue-100"
                : "text-gray-500 hover:text-primaryBlue hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("refer")}
          >
            Refer a Friend
          </button>
        </div>

        {/* Content Based on Active Tab */}
        <div>
          {activeTab === "unlimited" && (
            <div>
              <Text variant="body15R" extraCSS="text-gray-700 mb-4">
                Upgrade to unlock our most powerful AI and branding features.
              </Text>
              <Button
                label="Upgrade Now"
                type="primaryBlue"
                fullWidth
                onClick={() => {
                  if (pathname === "/pricing") {
                    onClose(); // Already on pricing, just close the popup
                  } else {
                    router.push("/pricing"); // Navigate to pricing page
                    onClose(); // Also close the popup after navigation
                  }
                }}
              />
            </div>
          )}

          {activeTab === "refer" && (
            <div>
              <Text variant="body15R" extraCSS="text-gray-700 mb-4">
                Give 200 credits and earn 200 credits for each new referral who
                signs up.
              </Text>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-1 py-1 shadow-sm">
                <input
                  type="text"
                  value="https://pollvault.app/signup?ref=abc123"
                  readOnly
                  className="px-2 bg-transparent w-full text-sm text-gray-700 focus:outline-none"
                />
                <Button
                  label="Copy Link"
                  type="primaryBlue"
                  customCss="text-nowrap text-sm p-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditsPopup;
