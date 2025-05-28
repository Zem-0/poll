"use client";
import { useState } from "react";
import { Snackbar, Alert, IconButton, Slide } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToaster = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = ({ message, type, duration = 3000 }: ToastOptions) => {
    setToast({ message, type, duration });
    console.log("toaster works");
  };

  const handleClose = () => {
    setToast(null);
  };

  const ToasterComponent = () => (
    <Snackbar
      open={!!toast}
      autoHideDuration={toast?.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={Slide} 
      TransitionProps={{
        onExit: (node: any) => {
          // Customize the exit behavior with additional animations or delay
          node.style.transitionDuration = "300ms";
          node.style.opacity = 0; // You can set opacity to fade out smoothly
        },
      }}
  >
      <Alert
        severity={toast?.type}
        sx={{
          backgroundImage:
          toast?.type === "success"
            ? "linear-gradient(to bottom, #6244D6, #2B6CE1)"
            : "none",
          backgroundColor:
            toast?.type === "success"
              ? "transparent"
              : toast?.type === "error"
              ? "#FF4A4A"
              : "#2b6ce1",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          minWidth: "250px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          "& .MuiAlert-icon": {
            color: "#fff", 
          },
        }}
        action={
          <IconButton size="small" onClick={handleClose} color="inherit">
            <AiOutlineClose fontSize="16px" />
          </IconButton>
        }
      >
        {toast?.message}
      </Alert>
    </Snackbar>
  );

  return { toast: showToast, ToasterComponent };
};

