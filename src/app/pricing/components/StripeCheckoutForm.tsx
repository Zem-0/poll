"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { MdErrorOutline } from "react-icons/md";
import { SparklesIcon } from "@heroicons/react/24/outline";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Props {
  open: boolean;
  onClose: () => void;
  price: string;
  planName: string;
}

const CheckoutInner = ({ onClose, planName, price }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "always",
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box className="space-y-6">
      {/* <Box>
        <Typography
          variant="h6"
          className="font-semibold text-lg text-gray-800"
        >
          Subscribe to the <span className="text-blue-600">{planName}</span>{" "}
          plan
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Total charge:{" "}
          <span className="font-semibold text-black">{price}</span>
        </Typography>
      </Box> */}

      <Box className="bg-white p-3 px-5 rounded-xl border border-gray-200 shadow-sm w-full mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Typography
            variant="h6"
            className="font-semibold text-[24px] bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
          >
            {planName} Plan
          </Typography>
        </div>
        <Typography className="mt-2 text-gray-700">
          Total charge:
          <span className="ml-2 text-lg font-bold text-black">{price}</span>
        </Typography>
      </Box>

      {/* <Divider /> */}
      <div className="relative w-full h-[3px] rounded-full overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
        {/* Moving Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-[slide_2s_linear_infinite]" />
      </div>

      <Box className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
        <PaymentElement />
      </Box>

      {status === "error" && (
        <Box className="flex items-center gap-2 text-red-600 mt-2 bg-red-50 border border-red-200 rounded-md p-3">
          <MdErrorOutline size={20} />
          <Typography variant="body2">{errorMsg}</Typography>
        </Box>
      )}

      <DialogActions className="flex justify-between mt-6 px-0">
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            color: "white",
            background: "linear-gradient(90deg, #3B82F6, #6366F1)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background: "linear-gradient(90deg, #2563EB, #4F46E5)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

const StripeCheckoutForm = ({ open, onClose, price, planName }: Props) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (open && price) {
      const fetchIntent = async () => {
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
        const res = await fetch("/api/payment/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: numericPrice }),
        });

        const data = await res.json();
        setClientSecret(data.clientSecret);
      };

      fetchIntent();
    }
  }, [open, price]);

  const options: any = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#3B82F6",
        fontFamily: "Inter, sans-serif",
        spacingUnit: "4px",
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-center font-semibold text-xl text-gray-800 pt-4">
        Complete Your Payment
      </DialogTitle>
      <DialogContent className="px-6 py-4">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutInner
              onClose={onClose}
              planName={planName}
              price={price}
            />
          </Elements>
        ) : (
          <Box className="flex justify-center items-center h-40">
            <div className="w-14 h-14">
              <img src="/loaders/loader-blue.gif" alt="loading-gif" />
            </div>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StripeCheckoutForm;
