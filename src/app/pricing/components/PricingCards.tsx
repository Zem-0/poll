import React from 'react';
import PricingCard from './PricingCard';

interface PricingCardsProps {
  pricingMode: "monthly" | "annual";
  helpType: string;
  currentPricing: {
    basic: number;
    premium: number;
    enterprise: number;
    priceIds: {
      basic: string;
      premium: string;
      enterprise: string;
    };
  };
}

const PricingCards: React.FC<PricingCardsProps> = ({ currentPricing }) => {
    
  const plans = [
    {
      id: 1,
      name: 'Basic',
      priceId: currentPricing.priceIds.basic,  // Stripe priceId for Basic plan
      price: `$${currentPricing.basic} / mo`,
      originalPrice: `$${currentPricing.basic + 9}`, // Assuming original price is higher by 9 units
      subtitle: 'FREE Trial! Perfect for anyone eager to break away from boring, complex, survey tools',
      description: 'Core AI survey & interview copilot',
      features: [
        '150 credits (enough for ~150 survey responses or up to 10 interviews!)',
        'Unlimited questions',
        'AI-powered insights (charts & insightful findings for your workflow)',
        'AI-tailored surveys, logic flows, and drop-off reduction with dynamic adaptation!',
      ],
      buttonLabel: 'Upgrade',
      isCurrentPlan: true,
      label: "Limited time discount!"
    },
    {
      id: 2,
      name: 'Premium',
      priceId: currentPricing.priceIds.premium, // Stripe priceId for Premium plan
      price: `$${currentPricing.premium} / mo`,
      originalPrice: `$${currentPricing.premium + 9}`, // Assuming original price is higher by 9 units
      subtitle: 'Perfect for professionals who want to WOW their clients or are looking for dynamic solutions',
      description: 'Personalized AI insights',
      features: [
        '600 credits (enough for ~600 respondents or up to 40 interviews!)',
        'Everything in Basic',
        'AI copilot for custom, unparalleled answers (1 credit / question)',
        'Dynamic follow-up (dive deeper into key responses as if you are in-person!)',
      ],
      buttonLabel: 'Upgrade',
      isCurrentPlan: false,
      label: "Limited time discount!"
    },
    {
      id: 3,
      name: 'Enterprise',
      priceId: currentPricing.priceIds.enterprise, // Stripe priceId for Enterprise plan
      price: 'Custom',
      originalPrice: '',
      subtitle: 'Ideal for businesses and standardized survey providers looking to add some flair',
      description: 'As good as meeting your customers',
      features: [
        'Everything in Pro',
        'Teams management, integrations, and customized reports & presentations',
        'Customized look and feel',
        'White-labeled solution, customized reports',
        'Enterprise-level support'
      ],
      buttonLabel: 'Send us a note',
      isCurrentPlan: false,
      label: "Coming soon"
    },
  ];

  return (
    <section className="w-full pricing-cards py-12 px-4 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {plans.map((plan) => (
          <PricingCard key={plan.id} {...plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingCards;
