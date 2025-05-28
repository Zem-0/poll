"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { setCurrentWorkspace } from "@/lib/features/dashboard/workspaceCurrentNameSlice";

// Import the dashboard component
import DashboardContent from "../dashboard_components/DashboardContent";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>("surveys");
  
  // Decode the URL-encoded workspace name
  const workspaceName = params.workspace ? decodeURIComponent(params.workspace as string) : "My workspace";
  
  // Get section from query params or default to "surveys"
  const sectionParam = searchParams.get("section");

  useEffect(() => {
    if (workspaceName) {
      // Set the decoded workspace name in Redux state
      dispatch(setCurrentWorkspace(workspaceName));
    }
    
    // Set the active section based on URL query parameter
    if (sectionParam) {
      setActiveSection(sectionParam.toLowerCase());
    } else {
      // If no section is specified, default to surveys
      setActiveSection("surveys");
    }
  }, [workspaceName, sectionParam, dispatch]);

  return <DashboardContent initialSection={activeSection} />;
}