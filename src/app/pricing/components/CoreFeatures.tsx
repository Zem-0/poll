import React from 'react';
import { MdDone } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";

const CoreFeatures = () => {
  const features = [
    { name: 'Credits', freeTrial: '5 credits', basic: '150 credits', premium: '600 credits' },
    { name: 'Unlimited questions', freeTrial: true, basic: true, premium: true },
    { name: 'AI-generated surveys', freeTrial: true, basic: true, premium: true },
    { name: 'Skip logic and branching', freeTrial: true, basic: true, premium: true },
    { name: 'AI drop-off risk detection', freeTrial: true, basic: true, premium: true },
    { name: 'AI survey adaptation', freeTrial: true, basic: true, premium: true },
    { name: 'Core visualizations & insights', freeTrial: true, basic: true, premium: true },
    { name: 'Download your data', freeTrial: true, basic: true, premium: true },
    { name: 'Adaptive voice interviews!!', freeTrial: false, basic: true, premium: true },
    { name: 'Customize Polly’s persona', freeTrial: false, basic: false, premium: true },
    { name: 'Dynamic follow-up', freeTrial: false, basic: false, premium: true },
    { name: 'Custom insights with Polly', freeTrial: false, basic: false, premium: true },
    { name: 'Support', freeTrial: false, basic: 'Via email', premium: 'Chat 24/7' },
  ];

  return (
    <section className="core-features py-10 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold mb-8 ">Core features</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="text-center text-sm">
                <th className="p-4 border-y text-left">Features</th>
                <th className="p-4 border-y">Free Trial</th>
                <th className="p-4 border-y">Basic</th>
                <th className="p-4 border-y">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-y font-medium">{feature.name}</td>
                  <td className="p-4 border-y text-center">
                    {typeof feature.freeTrial === 'boolean' ? (feature.freeTrial ? <MdDone className='mx-auto text-3xl text-blue-500'/> : <LiaTimesSolid className='mx-auto text-3xl text-gray-500'/>) : feature.freeTrial}
                  </td>
                  <td className="p-4 border-y text-center">
                    {typeof feature.basic === 'boolean' ? (feature.basic ? <MdDone className='mx-auto text-3xl text-blue-500'/> : <LiaTimesSolid className='mx-auto text-3xl text-gray-500'/>) : feature.basic}
                  </td>
                  <td className="p-4 border-y text-center">
                    {typeof feature.premium === 'boolean' ? (feature.premium ? <MdDone className='mx-auto text-3xl text-blue-500'/> : <LiaTimesSolid className='mx-auto text-3xl text-gray-500'/>) : feature.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
