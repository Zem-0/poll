"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box } from "@mui/material";
import Confetti from "confetti-react";
import Image from "next/image";
import Button from "@/components/ui/buttons/Button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
      position="relative"
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
        recycle={false}
      />
      <Image src={"/success-image.svg"} width={250} height={250} alt="image" />
      <Typography variant="h4" mt={2} fontWeight={600}>
        Payment Successful!
      </Typography>
      <Typography variant="body1" mt={1} color="text.secondary">
        Thank you for your purchase 🎉 <br />
        You’ll be redirected to your dashboard shortly.
      </Typography>
      <Button
        label="Go to Dashboard Now"
        type="gradient"
        onClick={() => router.push("/dashboard")}
        customCss="mt-6"
      />
    </Box>
  );
}
