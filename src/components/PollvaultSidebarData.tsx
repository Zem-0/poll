/* eslint-disable @next/next/no-img-element */
import React from "react";
import Text from "./ui/Texts/Text";

const PollvaultSidebarData = () => {
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
        <img src="/small_screen_logo.svg" alt="" />
      </div>
      <div className="md:w-1/4 align-center justify-center bg-gradient-to-br  from-Purple-Grad-Dark-900 to-Purple-Grad-Dark-500 hidden flex-1 lg:block">
        <div className="p-6">
          <img src="/logo.svg" alt="" />
        </div>
        <div className="flex justify-center items-center h-full">
          <div className="advantages flex flex-col gap-y-5 justify-center  w-3/5 xl:w-3/5">
            <div className="flex justify-center">
              <img src="/pollvaultLogo.svg" className="w-32" alt="" />
            </div>

            <div className="flex gap-3 font-semibold text-base items-start">
              <img src="/light.svg" alt=""></img>
              <Text variant="body15SB" extraCSS="text-primaryWhite">Engage audience dynamically</Text>
            </div>
            <div className="flex gap-3   font-semibold text-base items-start">
              <img src="/light.svg" alt=""></img>
              <Text variant="body15SB" extraCSS="text-primaryWhite">Gain nuanced insights</Text>
            </div>
            <div className="flex gap-3   font-semibold text-base items-start">
              <img src="/light.svg" alt=""></img>
              <Text variant="body15SB" extraCSS="text-primaryWhite">Increase responsiveness</Text>
            </div>
            <div className="flex gap-3  font-semibold text-base items-start">
              <img src="/light.svg" alt=""></img>
              <Text variant="body15SB" extraCSS="text-primaryWhite">Reduce drop-offs</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PollvaultSidebarData;
