/* eslint-disable @next/next/no-img-element */
"use client";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";

import PlatformSignup from "@/components/layouts/PlatformSignup";
import Privacy from "@/components/layouts/Privacy";
import PollvaultSidebarData from "@/components/PollvaultSidebarData";
import { inter } from "../../static/static_styles";
import { RequestOtp } from "../api/auth";
import Otp from "../otp/Otp";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [component, setComponent] = useState("form");
  const [loading, setLoading] = useState(false); // Loading state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);

    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(e.target.value);
    setIsValid(isValidEmail);
    
    // Enable button only if email is valid
    setIsButtonDisabled(!isValidEmail);
  };

  const handleContinueClick = async () => {
    if (!isValid) return;

    setLoading(true); // Start loading
    setIsButtonDisabled(true); // Disable the button during OTP request

    try {
      // Proceed with the OTP request
      await RequestOtp(email);
      setComponent("otp"); // Switch to OTP component if successful
    } catch (error) {
      console.error("Error requesting OTP:", error);
    } finally {
      setLoading(false); // Stop loading after the request
      setIsButtonDisabled(false); // Re-enable the button after the process
    }
  };

  return (
    <>
      <div className={`${inter.className} h-screen overflow-y-hidden`}>
        <div className="flex min-h-full flex-1">
          <PollvaultSidebarData />

          {component == "form" ? (
            <div className="w-3/4 md:w-3/4 bg-Bg-Gray flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className=" fixed top-0 right-0 p-4 z-50">
              <div className="flex flex-row gap-2 items-center justify-center">
                  <Text variant="body13R" extraCSS="text-textGray">
                    Adapt to your style?
                  </Text>
                  <Link href="/signin">
                    <Text variant="body13R" extraCSS="text-primaryBlue">
                      Sign in
                    </Text>
                  </Link>
                </div>
              </div>



              <div className="h-full flex flex-row items-center justify-center">
                <div className="h-4/5 xl:w-1/3  flex flex-col gap-6 justify-center">
                  <Text variant="h2">Sign up</Text>
                  <Text variant="body15SB">Use your favourite platform</Text>

                  <PlatformSignup />
                  <div className="flex flex-col mt-6  gap-4  rounded-xl">
                      <label htmlFor="email">
                        <Text variant="body15SB">OR enter your email to get</Text>
                      </label>
                      <div className="relative mt-2 rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <img src="mail.svg" className="h-5 w-5 text-gray-400" aria-hidden="true" alt="" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className={`${
                            isValid == true ? "" : "ring-2 text-red-900 ring-red-300"
                          } block w-full border border-Gray-Background rounded-md  py-3 pl-10 outline-none text-gray-900 ring-gray-300 placeholder:text-Lt-Dark-Gray placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6`}
                          placeholder="Email"
                          onChange={(e) => {
                            handleEmailChange(e);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isButtonDisabled) {
                              handleContinueClick();
                            }
                          }}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {isValid == false && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
                        </div>
                    </div>
                    <Privacy />
                    <Button
                      label="Continue"
                      type="primaryBlack"
                      clickAnimation={false}
                      onClick={() => handleContinueClick()}
                      loading={loading}
                      disabled={isButtonDisabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Otp email={email} redirect_uri="setup-password" />
          )}
        </div>
      </div>
    </>
  );
};

export default Signup;
