/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { UserData } from "@/app/types/Authentication/Authentication";
import PollvaultSidebarData from "@/components/PollvaultSidebarData";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { Icon } from "react-icons-kit";
import { SignUp } from "../api/auth";
import Text from "@/components/ui/Texts/Text";
import Link from "next/link";
import Button from "@/components/ui/buttons/Button";

const Page = () => {
  const [codestatus, setCodeStatus] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle the user data.
  const [user_data, setUserData] = useState<UserData>({
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const email = localStorage.getItem("email") || null;
    if (email !== null) {
      setUserData((prevData) => ({
        ...prevData,
        email: email,
      }));
    }
  }, []);

  function HandleUserData(e: any) {
    const { name, value } = e.target;
    const updatedData = { ...user_data, [name]: value };

    const passwordValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(
      updatedData.password
    );

    setDoPasswordsMatch(updatedData.password === updatedData.confirm_password);
    setIsPasswordValid(passwordValid);

    setUserData(updatedData);
  }

  async function handleSetupPassword() {
    if (!isPasswordValid || !doPasswordsMatch) {
      setCodeStatus(false);
      return;
    }

    setLoading(true); // Start loading
    setCodeStatus(true);

    try {
      const response = await SignUp(user_data.email, user_data.password);
      if (response?.status == 200) {
        // window.location.href = "basic-profile";
        window.location.href = "/signin";
      } else {
        // console.log(response);
      }
    } catch (err) {
      setCodeStatus(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        <div className="flex min-h-full flex-1">
          <PollvaultSidebarData />
          <div className="w-3/4 lg:w-3/4 bg-Bg-Gray flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
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
              <div className="h-4/5 xl:w-1/3 flex flex-col justify-center">
                <Text variant="h2">Setup password</Text>
                <Text variant="body15SB">
                  Please enter a new password for your account.
                </Text>
                <div className="mt-8 border-none outline-none">
                  <div className="relative mt-2 rounded-md shadow-sm border-none outline-none">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <img
                        src="mail.svg"
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      id="email"
                      className="block w-full border pl-10 border-Gray-Background rounded-md  py-3 outline-none text-gray-900 ring-gray-300 placeholder:text-Lt-Dark-Gray placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                    >
                      {user_data.email}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="email"
                      className="block w-full border border-Gray-Background rounded-md  py-3 pl-4 outline-none text-gray-900 ring-gray-300 placeholder:text-Lt-Dark-Gray placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                      placeholder="Enter password"
                      onChange={(e) => {
                        HandleUserData(e);
                      }}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon icon={showPassword ? eyeOff : eye} size={20} />
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirm_password"
                      id="email"
                      className={`block w-full border rounded-md py-3 pl-4 outline-none text-gray-900 placeholder:text-Lt-Dark-Gray placeholder:text-sm focus:ring-2 focus:ring-inset  focus:bg-white m:text-sm sm:leading-6 ${
                        !doPasswordsMatch
                          ? "ring-2 text-red-900 ring-red-300"
                          : "border-Gray-Background focus:ring-gray-100"
                      }`}
                      placeholder="Confirm password"
                      onChange={(e) => {
                        HandleUserData(e);
                      }}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon icon={showPassword ? eyeOff : eye} size={20} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-Lt-Gray text-center text-sm leading-5 mb-4">
                  Minimum 8 characters with at least one uppercase letter, one
                  number, and one symbol.
                </div>
                <Button
                  label="Continue"
                  type="primaryBlack" // Adjust type based on your design
                  onClick={() => handleSetupPassword()}
                  fullWidth
                  loading={loading} // Show loading indicator (if supported by Button)
                  disabled={
                    loading ||
                    !doPasswordsMatch ||
                    !user_data.password ||
                    !user_data.confirm_password
                  }
                />
                {!doPasswordsMatch && (
                  <p className="text-red-500 text-sm mt-1 my-2">
                    Passwords do not match.
                  </p>
                )}
                {!isPasswordValid && (
                  <p className="text-red-500 text-sm mt-1 text-center">
                    Password must be at least 8 characters long and include an
                    uppercase letter, number, and symbol.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
