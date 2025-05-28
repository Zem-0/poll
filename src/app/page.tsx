"use client";

import React, { useEffect, useState } from "react";
import LoginSignup from "../app/login-signup/page";
import { CheckRegistraction } from "./api/auth"; 
import HomeScreen from "@/components/HomeScreen/HomeScreen";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const access_token = localStorage.getItem("access_token") || null;

      if (!access_token) {
        console.log("No token found");
        setIsLoggedIn(false);
        return;
      }

      try {
        const isValid = await CheckRegistraction(access_token); // assume this returns a Promise
        if (isValid) {
          console.log("Token valid");
          setIsLoggedIn(true);
        } else {
          console.log("Token invalid");
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error validating token", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return <div className="flex justify-center items-center h-screen w-full">
       <img src="/loaders/starter-loading.svg" width={150} height={150} alt="loading" />
    </div>; 
  }

  return isLoggedIn ? <HomeScreen /> : <LoginSignup />;
}
