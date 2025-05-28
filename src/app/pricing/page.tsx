"use client";

import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import PlanSelection from "./components/PlanSelection";
import PricingCards from "./components/PricingCards";
import AdditionalCredits from "./components/AdditionalCredits";
import CoreFeatures from "./components/CoreFeatures";
import Navbar from "../component/Navbar";

// Define the types for pricing data
interface PricingData {
  basic: number;
  premium: number;
  enterprise: number;
  priceIds: {
    basic: string;
    premium: string;
    enterprise: string;
  };
}

interface PricingMode {
  monthly: PricingData;
  annual: PricingData;
}

interface PollSelection {
  analysisSurveys: PricingMode;
  fullSurveys: PricingMode;
}

const PricingPage = () => {
  // State for pricing mode (monthly or annual)
  const [pricingMode, setPricingMode] = useState<"monthly" | "annual">("monthly");

  // State for help type
  const [helpType, setHelpType] = useState<"analysisSurveys" | "fullSurveys">("analysisSurveys");

  // Define the pricing data structure with correct price IDs
  const pricingData: PollSelection = {
    analysisSurveys: {
      monthly: {
        basic: 20,
        premium: 50,
        enterprise: 100,
        priceIds: {
          basic: 'https://buy.stripe.com/test_28o01EfFMeCo8KsbIK',
          premium: 'plink_1Q6voi2MAZoiYcaAEKU4OhUq',
          enterprise: 'price_mno345AnalysisMonthEnterprise',
        },
      },
      annual: {
        basic: 15,
        premium: 40,
        enterprise: 90,
        priceIds: {
          basic: 'https://buy.stripe.com/test_28o01EfFMeCo8KsbIK',
          premium: 'https://buy.stripe.com/test_28o01EfFMeCo8KsbIK',
          enterprise: 'price_pqr678AnalysisAnnualEnterprise',
        },
      },
    },
    fullSurveys: {
      monthly: {
        basic: 25,
        premium: 55,
        enterprise: 120,
        priceIds: {
          basic: 'https://buy.stripe.com/test_28o01EfFMeCo8KsbIK',
          premium: 'price_123FullMonthPremium',
          enterprise: 'price_456FullMonthEnterprise',
        },
      },
      annual: {
        basic: 18,
        premium: 45,
        enterprise: 110,
        priceIds: {
          basic: 'https://buy.stripe.com/test_28o01EfFMeCo8KsbIK',
          premium: 'price_789FullAnnualPremium',
          enterprise: 'price_012FullAnnualEnterprise',
        },
      },
    },
  };

  // Get the current pricing and priceId based on selected helpType and pricingMode
  const currentPricing = pricingData[helpType][pricingMode];

  return (
    <div className="pricing-page bg-gray-50">
      <Navbar />
      <HeroSection />
      <PlanSelection
        pricingMode={pricingMode}
        setPricingMode={setPricingMode}
        helpType={helpType}
        setHelpType={setHelpType}
      />
      <PricingCards
        pricingMode={pricingMode}
        helpType={helpType}
        currentPricing={currentPricing} // Pass the current pricing data
      />
      <AdditionalCredits />
      <CoreFeatures />
    </div>
  );
};

export default PricingPage;
