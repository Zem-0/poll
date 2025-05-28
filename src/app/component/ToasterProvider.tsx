"use client";

import React, { createContext, useContext } from "react";
import { useToaster } from "@/utils/hooks/useToaster";

const ToasterContext = createContext<any>(null);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast: showToast, ToasterComponent } = useToaster();

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      <ToasterComponent />
    </ToasterContext.Provider>
  );
};

export const useToast = () => useContext(ToasterContext);

// //// below is the usecase to use it...
// const { showToast } = useToast(); 
// showToast({ type: "success", message: "This is a success message!" });
// showToast({ type: "info", message: "This is a info message!" });
// showToast({ type: "error", message: "This is a error message!" });


