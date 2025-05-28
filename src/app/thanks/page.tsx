/* eslint-disable @next/next/no-img-element */
import React from "react";

const Thanks = () => {
  return (
    <>
      <div className=" flex p-2 pl-6 pr-6 md:bg-Background ">
        <div className="w-1/2">
          <img src="logo.svg" alt="" />
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <span>
            Adapt to your style?{" "}
            <button className="text-Golden">Sign in</button>
          </span>
        </div>
      </div>
      <div className="h-full md:min-h-screen flex items-center justify-center  md:bg-Background">
        <div className="h-full md:h-full w-full lg:max-w-2xl xl:max-h-3/5 200 xl:max-w-md p-8 rounded-xl md:shadow-2xl bg-white">
          <div>
            <div className="" aria-hidden="true">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-1/3 overflow-hidden rounded-full">
                  <div
                    className="h-3 rounded-full bg-Coral"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="ml-2">
                  <span className=" text-black font-semibold">
                    100% complete
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-12">
            <img src="images/fun.svg" className="w-64" alt="" />
          </div>
          <div className="flex w-full">
            <div className="w-1/6 "></div>
            <div className="w-5/6 bg-Lt-gray flex items-center p-2 pt-4 pb-2 rounded-r-xl rounded-t-xl text-Pri-Dark">
              Yay!! Thanks for taking time to share your insights with me today.
              😊
            </div>
            <div className="w-1/6 "></div>
          </div>
          <div className="flex w-full mt-2">
            <div className="w-1/6 flex justify-center items-end">
              <img src="Squircle.svg" alt="" className="h-3/4 flex" />
            </div>
            <div className="w-5/6 bg-Lt-gray flex items-center p-2 rounded-b-xl rounded-r-xl text-Pri-Dark">
              Your insights will help shape our next set of features to help
              caregivers!
            </div>
            <div className="w-1/6"></div>
          </div>
          <div></div>
          <div className="flex justify-center mt-8">
            <button className="w-full bg-Pri-Dark text-white mt-2 p-3 rounded-xl">
              Thanks!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Thanks;
