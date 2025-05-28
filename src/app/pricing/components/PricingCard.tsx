"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import Button from "@/components/ui/buttons/Button";

interface PricingCardProps {
  name: string;
  price: string;
  originalPrice: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonLabel: string;
  isCurrentPlan: boolean;
  label: string;
  priceId: string; // Stripe price ID for the plan
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  originalPrice,
  subtitle,
  description,
  features,
  buttonLabel,
  isCurrentPlan,
  label,
  priceId,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`max-w-[375px] relative pricing-card flex flex-col justify-between bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${isCurrentPlan ? "border-2 border-blue-500" : ""}`}
    >
      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex justify-between gap-3 items-center">
          {name == "Premium" ? (
            <h3 className="text-xl font-semibold text-[#3E90F0]">{name}</h3>
          ) : name == "Enterprise" ? (
            <h3 className="text-xl font-semibold text-[#136B80]">{name}</h3>
          ) : (
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          )}
          {label === "Coming soon" ? (
            <div className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-semibold text-center rounded-md">
              {label}
            </div>
          ) : (
            <div className="bg-orange-100 text-orange-600 px-2 py-1 text-xs font-semibold  text-center rounded-md">
              {label}
            </div>
          )}
        </div>
        {/* Description Section */}
        <p className="text-gray-700 mb-6 text-sm">{description}</p>
      </div>

      {/* Price Section */}
      <div className="text-center mb-4">
        <div className="flex gap-2 items-center justify-start">
          {originalPrice && (
            <p className="text-4xl line-through text-gray-500">
              {originalPrice}
            </p>
          )}
          <p className="text-4xl font-bold ">{price}</p>
          <span></span>
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 text-left mt-2 border-b pb-4 border-gray-300">
            {subtitle}
          </p>
        )}
      </div>

      {/* Features List */}
      <ul className="text-xs text-gray-600 mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start my-1">
            <img
              src="/images/tick-solid.svg"
              alt="Check"
              className="w-4 h-4 mr-2 "
            />
            <p>{feature}</p>
          </li>
        ))}
      </ul>

      {/* Button Section */}
      <button
  className="w-full py-3 rounded-md font-medium border border-gray-300 text-black 
             bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 
             hover:text-white transition-all duration-300 ease-in-out 
             hover:shadow-lg hover:-translate-y-[1px]"
  onClick={() => setOpen(true)}
>
  {buttonLabel}
</button>



      <StripeCheckoutForm
        open={open}
        onClose={() => setOpen(false)}
        price={price}
        planName={name}
      />
    </div>
  );
};

export default PricingCard;
