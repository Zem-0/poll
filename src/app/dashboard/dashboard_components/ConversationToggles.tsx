"use client";
import React from "react";
import { styled, ToggleButton, ToggleButtonGroup, Tooltip, tooltipClasses } from "@mui/material";
import Text from "@/components/ui/Texts/Text";

interface ConversationTogglesProps {
  contentOption: string;
  setContentOption: (value: string) => void;
}

const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#F5F5F5", // Soft Gray Background for better contrast
      color: "#183D81", // Deep Blue Text for readability
      fontSize: "13px",
      fontWeight: 500,
      padding: "10px 12px",
      borderRadius: "8px",
      boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.15)", // Slightly deeper shadow for floating effect
      maxWidth: "220px",
      textAlign: "center",
      border: "1px solid #BBDEFB", // Subtle border for definition
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#183D81", // Slightly darker gray for better arrow visibility
    },
  }));
  

const ConversationToggles: React.FC<ConversationTogglesProps> = ({
  contentOption,
  setContentOption,
}) => {

  return (
    <div >
      <Text variant="body15SB" extraCSS="text-[16px] mb-2">
        Select conversation types:
      </Text>
      <ToggleButtonGroup
        color="primary"
        value={contentOption}
        exclusive
        onChange={(e, newValue) => {
          if (newValue !== null) setContentOption(newValue);
        }}
        className="flex"
      >
        <CustomTooltip arrow disableInteractive title="Ideal for high volume, low-cost conversational experience primarily focused on collecting insights">
          <ToggleButton
            value="simple"
            sx={{ fontSize: "12px" }}
            className={`px-2 py-1 bg-blue-500 rounded-md transition-all duration-300
              ${contentOption === "brief" && "bg-blue-500 text-white shadow-md"}`}
          >
            Simple
          </ToggleButton>
        </CustomTooltip>

        <CustomTooltip disabled arrow disableInteractive title="Ideal for chat based free flowing conversations that collect insights, while dynamically adapting to each respondent's personal style and goals">
          <ToggleButton
            value="dynamic"
            sx={{ fontSize: "12px" }}
            className={`px-5 py-2 rounded-md transition-all duration-300
              ${contentOption === "detailed" && "bg-blue-500 text-white shadow-md"}`}
          >
            Dynamic Chats
          </ToggleButton>
        </CustomTooltip>

        <CustomTooltip disabled arrow disableInteractive title="Ideal for conducting dynamic voice interviews as if you are conducting them yourself!">
          <ToggleButton
            value="interview"
            sx={{ fontSize: "12px" }}
            className={`px-5 py-2 rounded-md transition-all duration-300
              ${contentOption === "template" && "bg-blue-500 text-white shadow-md"}`}
          >
            Interview
          </ToggleButton>
        </CustomTooltip>
      </ToggleButtonGroup>
    </div>
  );
};

export default ConversationToggles;
