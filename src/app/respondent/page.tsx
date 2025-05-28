/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React, { useState, useRef, ChangeEvent } from "react";

import { VerifyCode } from "../api/auth";

const Respondent: React.FC = () => {
  const [codestatus, setCodeStatus] = useState<boolean | null>(true);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputs = useRef<HTMLInputElement[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Move focus to the next input field
    if (index < code.length - 1 && value !== "") {
      otpInputs.current[index + 1].focus();
    }
    setCodeStatus(null);
  };

  const handleCodeSubmit = async () => {
    try {
      const response = await VerifyCode(code.join(""));
      if (response?.status === 200) {
        setCodeStatus(true);

        window.location.href = `/conversation/${code.join("")}`;
      } else {
        setCodeStatus(false);
      }
    } catch (err) {
      setCodeStatus(false);
    }
  };

  return (
    <>
      <div className="h-screen overflow-y-hidden flex  flex-col   bg-opacity-90 bg-Background  ">
        <div className=" p-6 hidden xl:flex">
          <img src="/white_background_logo.svg" alt="" />
          <div className="ml-auto gap-2 flex">
            <span className="text-purple-800">Sign in</span>
            <span className="text-Pri-Dark">| New here ?</span> <span className="text-blue-500">Sign up</span>
          </div>
        </div>
        <div className="grow w-screen flex items-center bg-opacity-90 bg- flex-col justify-center">
          <div className=" w-full md:h-3/5 md: md:w-2/5 p-4 rounded-xl shadow-2xl flex bg-white">
            <div className="h-full ">
              <div className="flex  h-full flex-1 ">
                <div className="lg:hidden fixed top-0 left-0 p-8 z-50">
                  <img src="/small_screen_logo.svg" alt="" />
                </div>
                <div className="sm:w-3/5  h-full align-center justify-center or relative hidden flex-1 lg:block ">
                  <div className="h-full w-full bg-Bg-Gray">
                    <div className="flex justify-center items-center h-full bg-Bg-Gray mt-2 rounded-xl">
                      {" "}
                      <div className="advantages flex flex-col justify-center 0 h-full p-4 ">
                        <div className="flex justify-center">
                          <img src="/notes.png" className="w-64" alt="" />
                        </div>
                        <div className="flex pt-4 pb-4 flex-col">
                          <div className="flex justify-end text-center font-medium text-base text-Pri-Dark">
                            “Precise, empirical, and undeniably superior – the only way to conduct a survey with a smidgen of fun. Anything less would be... illogical.{""}
                          </div>
                          <div className="flex justify-center m-4 italic text-Pri-Dark">- Sheldon Cooper</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-3/5 flex flex-col items-center justify-center overflow-x-hidden ">
                  <div className="h-5/6 flex flex-col lg:w-5/6 justify-center ">
                    <div className="mb-6 font-semibold text-Pri-Dark">Enter your poll code OR click on the link received.</div>
                    <div className="flex justify-between items-center gap-4">
                      {code?.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          value={digit}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleCodeChange(index, e.target.value)}
                          className="w-1/5 h-14 border rounded-lg text-center outline-none text-black bg-opacity-50 focus:border-Purple-Border bg-otp_input"
                          maxLength={1}
                          ref={(input) => {otpInputs.current[index] = input as HTMLInputElement}}
                        />
                      ))}
                    </div>
                    <div className="text-Dark-gray mt-6">
                      By continuing you agree with our{" "}
                      <Link href="/">
                        <button className="text-yellow-600">Privacy Policy</button>
                      </Link>{" "}
                      and
                      <Link href="/">
                        <button className="text-yellow-600">Terms of Service</button>
                      </Link>
                    </div>
                    {codestatus === false && <div className="text-Sec-Amber font-semibold mt-6">Sorry you something is wrong. Please ensure you entered correct code.</div>}
                  </div>
                  <div className=" h-1/6 w-full items-center flex justify-center md:justify-end">
                    <button
                      className="w-3/4 md:w-1/3 h-10 sm:mb-2 mb:w-full mb-4 mt-2  bottom-0 left-0 right-0 font-semibold bg-Pri-Dark  rounded-xl text-white"
                      onClick={() => {
                        handleCodeSubmit();
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Respondent;
