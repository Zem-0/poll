"use client";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { VerifyOtp } from "../api/auth";
import Button from "@/components/ui/buttons/Button";

interface OtpProps {
  email: string;
  redirect_uri: string;
}

const Otp: React.FC<OtpProps> = ({ email, redirect_uri }) => {
  const [otpstatus, setOtpStatus] = useState<boolean | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(15 * 60); // 30 minutes in seconds
  const [loading, setLoading] = useState(false); // Loading state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Button disabled state
  const otpInputs = useRef<HTMLInputElement[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move focus to the next input field if value is entered
    if (index < otp.length - 1 && value !== "") {
      otpInputs.current[index + 1].focus();
    }

    // Disable button if OTP is not fully filled
    const isOtpComplete = newOtp.every((digit) => digit !== "");
    setIsButtonDisabled(!isOtpComplete);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleOtpSubmit = async () => {
    setLoading(true); // Start loading
    setIsButtonDisabled(true); // Disable the button while verifying

    try {
      const response = await VerifyOtp(email, otp.join(""));
      if (response === true) {
        setOtpStatus(true);
        window.location.href = `${redirect_uri}`;
      } else {
        setOtpStatus(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpStatus(false);
    } finally {
      setLoading(false); // Stop loading
      setIsButtonDisabled(false); // Enable the button after verification
    }
  };

  return (
    <>
      <div className="md:w-3/4 sm:w-3/5 flex flex-col items-center justify-center overflow-x-hidden ">
        <div className="flex flex-col gap-4">
          <div className="font-sans text-xl font-bold text-Pri-Dark">Enter code</div>
          <div className="font-inter text-medium font-semibold text-Pri-Dark">
            Check your inbox for a verification code.
          </div>
          <div className="flex justify-between items-center gap-4">
            {otp?.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 border rounded-md text-center text-black bg-white hover:border-2 hover:border-Purple-Border outline-none"
                maxLength={1}
                ref={(input) => {
                  otpInputs.current[index] = input as HTMLInputElement;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isButtonDisabled) {
                    handleOtpSubmit();
                  } else if (e.key === "Backspace" && digit === "") {
                    if (index > 0) {
                      otpInputs.current[index - 1].focus();
                      const newOtp = [...otp];
                      newOtp[index - 1] = ""; // Clear the previous field
                      setOtp(newOtp);
                    }
                  }
                }}
              />
            ))}
          </div>

          <div className="text-Dark-gray mt-6 flex justify-between gap-2 text-msm">
            <span className="font-medium pr-1">Code valid for another</span>
            <span className="font-bold pr-1 text-Sec-Amber">{formatTime(timer)} <span className="text-Dark-gray font-medium">min.</span></span>
            <button className="text-Normal-Blue font-semibold pl-2" disabled={loading || timer <= 0}>
              Resend code
            </button>
          </div>

          <center>
            <Button
              label={loading ? "Verifying..." : "Continue"} // Show loading text
              type="primaryBlack"
              onClick={handleOtpSubmit}
              loading={loading} // Set loading state
              disabled={isButtonDisabled || loading} // Disable button if OTP is incomplete or loading
              fullWidth
            />

            {otpstatus === false && (
              <div className="text-Sec-Amber flex justify-center mt-4">
                Invalid code entered. Please check or click resend.
              </div>
            )}
          </center>
        </div>
      </div>
    </>
  );
};

export default Otp;
