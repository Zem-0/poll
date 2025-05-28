"use client";
import React from "react";
import { Radio } from "@mui/material";

interface PlanSelectionProps {
  pricingMode: "monthly" | "annual";
  setPricingMode: React.Dispatch<React.SetStateAction<"monthly" | "annual">>;
  helpType: "analysisSurveys" | "fullSurveys";
  setHelpType: React.Dispatch<React.SetStateAction<"analysisSurveys" | "fullSurveys">>;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({
  pricingMode,
  setPricingMode,
  helpType,
  setHelpType,
}) => {
  return (
    <div className="plan-selection py-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-4xl space-y-14">
        {/* Help Type Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
            1. What do you need help with?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                helpType === "fullSurveys"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setHelpType("fullSurveys")}
            >
              <label className="flex items-start gap-4">
                <Radio
                  checked={helpType === "fullSurveys"}
                  onChange={() => setHelpType("fullSurveys")}
                  value="fullSurveys"
                  color="primary"
                />
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    Analyze findings for better reports & presentations
                  </p>
                  <p className="text-sm text-gray-500">
                    Work with insights from surveys and interviews.
                  </p>
                </div>
              </label>
            </div>
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                helpType === "analysisSurveys"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setHelpType("analysisSurveys")}
            >
              <label className="flex items-start gap-4">
                <Radio
                  checked={helpType === "analysisSurveys"}
                  onChange={() => setHelpType("analysisSurveys")}
                  value="analysisSurveys"
                  color="primary"
                />
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    Create surveys that WOW your audience
                  </p>
                  <p className="text-sm text-gray-500">
                    Make your data collection process more engaging.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Mode Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
            2. How committed are you to change?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                pricingMode === "annual"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setPricingMode("annual")}
            >
              <label className="flex items-start gap-4">
                <Radio
                  checked={pricingMode === "annual"}
                  onChange={() => setPricingMode("annual")}
                  value="annual"
                  color="success"
                />
                <div>
                  <p className="text-gray-800 font-medium mb-1">Annual Commitment</p>
                  <p className="text-sm text-gray-500">Yes, I’m in for long-term impact!</p>
                </div>
              </label>
            </div>
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                pricingMode === "monthly"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setPricingMode("monthly")}
            >
              <label className="flex items-start gap-4">
                <Radio
                  checked={pricingMode === "monthly"}
                  onChange={() => setPricingMode("monthly")}
                  value="monthly"
                  color="info"
                />
                <div>
                  <p className="text-gray-800 font-medium mb-1">Monthly Plan</p>
                  <p className="text-sm text-gray-500">Try it out with recurring access.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;






// interface PlanSelectionProps {
//   pricingMode: "monthly" | "annual";
//   setPricingMode: React.Dispatch<React.SetStateAction<"monthly" | "annual">>;
//   helpType: "analysisSurveys" | "fullSurveys"; 
//   setHelpType: React.Dispatch<React.SetStateAction<"analysisSurveys" | "fullSurveys">>;
// }

// const PlanSelection: React.FC<PlanSelectionProps> = ({
//   pricingMode,
//   setPricingMode,
//   helpType,
//   setHelpType,
// }) => {
//   return (
//     <div className="plan-selection py-8 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-2xl font-semibold mb-4">1. Choose what you need help with?</h2>
//         <div className="flex flex-col space-y-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="fullSurveys"
//               checked={helpType === "fullSurveys"}
//               onChange={() => setHelpType("fullSurveys")} // This should now be typed correctly
//               className="mr-2"
//             />
//             Analyzing survey and interview findings to build better reports & presentations
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="analysisSurveys"
//               checked={helpType === "analysisSurveys"}
//               onChange={() => setHelpType("analysisSurveys")} // This should now be typed correctly
//               className="mr-2"
//             />
//             Creating dynamic surveys and interviews that WOW my audience
//           </label>
//         </div>

//         <h2 className="text-2xl font-semibold mb-4 mt-8">2. How committed are you to make a change?</h2>
//         <div className="flex flex-col space-y-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="annual"
//               checked={pricingMode === "annual"}
//               onChange={() => setPricingMode("annual")}
//               className="mr-2"
//             />
//             Annual (Yes, I think this is cool!)
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="monthly"
//               checked={pricingMode === "monthly"}
//               onChange={() => setPricingMode("monthly")}
//               className="mr-2"
//             />
//             Monthly (Recurring)
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanSelection;


