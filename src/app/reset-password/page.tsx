/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";

import PollvaultSidebarData from "@/components/PollvaultSidebarData";

import { confirmPassword } from "../../utils/auth/auth";
import { ResetPasswords } from "../api/auth";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";

const ResetPassword = () => {
  const [codestatus, setCodeStatus] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState(""); 
  const [user_data, setUserData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    setUserData((prevUserdata) => ({
      ...prevUserdata,
      email: localStorage.getItem("email") || "",
    }));
  }, []);

  const validatePassword = (password: string) => {
    // Regular expression for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  function HandleUserData(e: any) {
    const { name, value } = e.target;

    setUserData((prevUserdata) => ({
      ...prevUserdata,
      [name]: value,
    }));

    // Reset code status when user modifies input fields
    setCodeStatus("");

    // Password validation and error state
    if (name === "password" && !validatePassword(value)) {
      setPasswordError("Minimum 8 characters with at least one uppercase letter, one number, and one symbol.");
      setIsButtonDisabled(true);
    } else if (name === "password") {
      setPasswordError(""); // Clear error if the password meets the criteria
    }

    // Enable the button when the input fields are not empty and passwords meet the criteria
    setIsButtonDisabled(
      user_data.password === "" || user_data.confirm_password === "" || passwordError !== ""
    );
  }

  async function handleResetPassword() {
    if (confirmPassword(user_data.password, user_data.confirm_password) == false) {
      setCodeStatus("Passwords do not match.");
      return;
    }
    setLoading(true); // Start loading state
    setIsButtonDisabled(true); // Disable the button while loading
    try {
      const response = await ResetPasswords(user_data.email, user_data.password);
      if (response?.status === 200) {
        window.location.href = "/signin";
      }else {
        setCodeStatus("Failed to reset the password. Try again."); // Handle unsuccessful response
      }
    } catch (err) {
      setCodeStatus("Failed to reset the password. Try again.");
    }finally {
      setLoading(false); // Stop loading state
      setIsButtonDisabled(false); // Re-enable the button after the process
    }
  }
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        <div className="flex min-h-full flex-1">
          <PollvaultSidebarData />
          <div className="w-3/4 lg:w-3/4 bg-primaryWhite flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="h-full flex flex-row items-center justify-center">
              <div className="flex flex-col justify-center ">
                <Text variant="h2">Reset password</Text>
                <Text variant="body15SB">Please enter a new password for your account.</Text>
                <div className="mt-8 border-none outline-none">
                  <div className="relative mt-2 rounded-md shadow-sm border-none outline-none">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <img src="mail.svg" className="h-5 w-5 text-gray-400" aria-hidden="true" alt="" />
                    </div>
                    <div
                      id="email"
                      className="bg-white cursor-not-allowed block w-full rounded-lg border-none py-3 pl-10 outline-none text-Lt-Dark-Gray  ring-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                    >
                      {user_data.email || "Your Mail"}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="bg-white  relative mt-2 rounded-md shadow-sm flex flex-tow items-center">
                    <input
                      type={type}
                      name="password"
                      placeholder="Password"
                      className="block w-full rounded-lg text-sm border-0 py-3 px-3 outline-none text-Lt-Dark-Gray ring-gray-300 placeholder:text-Lt-Dark-Gray focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                      onChange={(e) => {
                        HandleUserData(e);
                      }}
                      autoComplete="current-password"
                    />
                    <span className="flex justify-around items-center" onClick={handleToggle}>
                      <Icon className="absolute mr-10" icon={icon} size={25} />
                    </span>
                  </div>
                </div>

                <div className="my-2">
                  <div className="bg-white relative my-2 rounded-md shadow-sm flex items-center">
                    <input
                      type={type}
                      name="confirm_password"
                      placeholder="Confirm Password"
                      className="block w-full rounded-lg text-sm border-0 py-3 px-3 outline-none text-Lt-Dark-Gray ring-gray-300 placeholder:text-Lt-Dark-Gray focus:ring-2 focus:ring-inset focus:ring-gray-100 focus:bg-white m:text-sm sm:leading-6"
                      onChange={(e) => HandleUserData(e)}
                      autoComplete="current-password"
                    />
                    <span className="flex justify-around items-center" onClick={handleToggle}>
                      <Icon className="absolute mr-10" icon={icon} size={25} />
                    </span>
                  </div>
                </div>

                {passwordError && (
                  <Text variant="body13M" extraCSS="text-textGray w-[335px] text-center my-4">
                    {passwordError}
                  </Text>
                )}

                <Button
                  label="Continue"
                  type="primaryBlack"
                  onClick={() => handleResetPassword()}
                  loading={loading}
                  disabled={isButtonDisabled}
                />

                <Text variant="body13M" extraCSS="text-primaryRed text-center my-2">{codestatus}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
