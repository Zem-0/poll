/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// import Privacy from "@/components/layouts/Privacy";
import PollvaultSidebarData from "@/components/PollvaultSidebarData";

import { RequestOtp } from "../api/auth";
import Otp from "../otp/Otp";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";

const ForgotPassword = () => {
  const [component, setComponent] = useState("forgot_password");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Button disabled state

  // const [forgot, setForgot] = useState(false);

    // Function to validate email format
    const isValidEmail = (email: string) => {
      // Simple email regex for validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    useEffect(() => {
      if (isValidEmail(email)) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }, [email]);

  async function resetLink(e: any) {
    e.preventDefault();
    setLoading(true); // Start loading
    setComponent("forgot_message");
    try {
      const response = await RequestOtp(email);
      if (response == true) {
        // setForgot(true);
        // setComponent("forgot_message");
      }else {
        // Handle unsuccessful response
        console.log("Error requesting OTP");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        <div className="flex min-h-full bg-Bg-Gray flex-1">
          <PollvaultSidebarData />

          {component == "enter_otp" && (
            <Otp email={email} redirect_uri="dashboard" />
          )}

          {component != "enter_otp" && (
            <div className=" md:w-3/4 sm:w-3/5  flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-0 xl:py-0">
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
                <div className="h-4/5 w-3/5  flex flex-col justify-center md:w-1/4 min-w-[300px]">
                  <div className="flex justify-center md:justify-start text-Pri-Dark">
                    <Text variant="h2">Forgot password</Text>
                  </div>
                  {component == "forgot_password" && (
                    <>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-6">
                          <div></div>
                          <div className="block text-sm font-semibold  text-Pri-Dark">
                            <Text variant="body15SB">
                              If you have an account, a unique link will be sent
                              to your email.
                            </Text>
                          </div>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <img
                                src="mail.svg"
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                                alt="image"
                              />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="block w-full rounded-md border-0 py-3 pl-10 outline-none text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                              placeholder="Email"
                              onChange={(e) => {
                                setEmail(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <Button
                           label="Continue"
                           onClick={resetLink}
                           loading={loading}
                           disabled={isButtonDisabled || loading}
                           fullWidth
                           type="primaryBlack"
                        />
                      </div>
                    </>
                  )}
                  {component == "forgot_message" && (
                    <>
                      <Text variant="body15M" extraCSS="mt-4">
                        If you have an account, a unique link has been sent to
                        your email. You can click the link to set a new
                        password.
                      </Text>
                      <Link
                        href="/reset-password"
                        className="my-4"
                        onClick={() => setComponent("enter_otp")}
                      >
                        <Button label="Continue" fullWidth />
                      </Link>
                    </>
                  )}
                  <div className="mt-2">
                    {/* <Privacy /> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
