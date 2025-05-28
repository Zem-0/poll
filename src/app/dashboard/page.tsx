"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Set default workspace in state
    dispatch(setCurrentWorkspace("My workspace"));
    
    // Redirect to the default workspace route
    redirect("/dashboard/My%20workspace");
  }, [dispatch]);
  
  // This return is only shown during initial render before redirect
  return null;
}
