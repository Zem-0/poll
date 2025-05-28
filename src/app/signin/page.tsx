/* eslint-disable @next/next/no-img-element */
"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";

import { SignIn } from "@/app/api/auth";
import PlatformSignup from "@/components/layouts/PlatformSignup";
import Privacy from "@/components/layouts/Privacy";
import PollvaultSidebarData from "@/components/PollvaultSidebarData";
import { inter } from "../../static/static_styles";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";

const Signin = () => {
  const [isValid, setIsValid] = useState(true);
  // Manage the user email and the password
  const [user_data, setUserData] = useState({
    email: "",
    password: "",
  });
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Function to store the values on each time there is an event.
  function HandleUserData(e: any) {
    setUserData((prevUserdata) => ({
      ...prevUserdata,
      [e.target.name]: e.target.value,
    }));
    setIsValid(true);
  }

  async function handleSignin() {
    setLoading(true);
    try {
      const response = await SignIn(user_data.email, user_data.password);
      if (response?.status == 200) {
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("email", user_data.email);
        // window.location.href = `/dashboard/${encodeURIComponent("My workspace")}`;
        window.location.href = "/";
      } else {
        setIsValid(false);
      }
    } catch (err) {
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if inputs are valid
  useEffect(() => {
    if (
      user_data.email &&
      user_data.password &&
      isValidEmail(user_data.email)
    ) {
      setIsButtonDisabled(false); // Enable button if all inputs are valid
    } else {
      setIsButtonDisabled(true); // Disable button if any input is invalid
    }
  }, [user_data.email, user_data.password]);

  return (
    <>
      <div className={`${inter.className} h-screen overflow-y-hidden`}>
        <div className="flex min-h-full flex-1">
          <PollvaultSidebarData />

          <div className="w-3/4 lg:w-3/4 bg-primaryWhiteBg flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className=" fixed top-0 right-0 p-4 z-50">
              <div className="flex flex-row gap-2 items-center justify-center">
                <Text variant="body13R" extraCSS="text-textGray">
                  New here?
                </Text>
                <Link href="/signup">
                  <Text variant="body13R" extraCSS="text-primaryBlue">
                    Sign up
                  </Text>
                </Link>
              </div>
            </div>
            <div className="h-full flex flex-row items-center justify-center">
              <div className="h-4/5 xl:w-1/3  flex flex-col  gap-6  justify-center">
                <Text variant="h2">Sign in</Text>

                <Text variant="body15SB">Use your favourite platform</Text>
                <PlatformSignup />
                <div className="flex items-center bg-Signup-input-color  rounded-xl"></div>
                <div className=" flex flex-col gap-4">
                  <Text variant="body15SB">OR enter your email to get</Text>
                  <div className="relative  rounded-md ">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <img
                        src="mail.svg"
                        className="h-5 w-5 text-gray-400 opacity-90"
                        aria-hidden="true"
                        alt="icon"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={`${!isValid && "ring-2 text-red-900 ring-red-300"} 
                        block w-full rounded-md border border-Gray-Background py-3 pl-10 outline-none  placeholder:font-sm placeholder:text-sm text-gray-900 ring-gray-300 placeholder:text-Lt-Dark-Gray focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6`}
                      placeholder="Email"
                      onChange={(e) => {
                        HandleUserData(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isButtonDisabled) {
                          handleSignin();
                        }
                      }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {isValid == false && (
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>

                  <div className="relative  rounded-lg  flex flex-row">
                    <input
                      type={type}
                      name="password"
                      placeholder="Enter password"
                      className="block w-full rounded-md border border-Gray-Background  h-10 px-3 py-6  text-gray-900 placeholder:font-sm placeholder:text-sm placeholder:text-Lt-Dark-Gray focus:ring-2 focus:ring-inset focus:ring-gray-100 outline-none focus:bg-white m:text-sm sm:leading-6"
                      onChange={(e) => HandleUserData(e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isButtonDisabled) {
                          handleSignin();
                        }
                      }}
                      autoComplete="current-password"
                    />
                    <div
                      className="flex justify-around items-center"
                      onClick={handleToggle}>
                      <Icon className="absolute mr-10" icon={icon} size={25} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center">
                  {/* <div className="flex flex-row items-center gap-2">
                    <div>
                      <img src="/images/auth/Checkbox input.svg" alt="" />
                    </div>
                    <Texts
                      variant={TextVariants.SmallText}
                      data="Remember me"
                    />
                  </div> */}
                  <Link href="/forgot-password">
                    <Text variant="body13M" extraCSS="text-primaryBlue">Forgot your password?</Text>
                  </Link>
                </div>

                <Privacy />
                <Button
                  label="Sign In"
                  type="primaryBlack"
                  onClick={() => handleSignin()}
                  loading={loading}
                  disabled={isButtonDisabled}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
