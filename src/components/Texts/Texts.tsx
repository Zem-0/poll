import React from "react";

import { TextVariants } from "@/constants/enums/HeaderEnums/HeaderEnums";

interface TextProps {
  variant: string;
  data: string;
  customCss?: string;
}

const Texts: React.FC<TextProps> = ({ variant, data, customCss = "" }) => {
  const getClassName = () => {
    switch (variant) {
      case TextVariants.Header:
        return "text-3xl font-bold";

      case TextVariants.SubHeader:
        return "text-xl font-semibold font-sans";

      case TextVariants.Title:
        return "text-xl font-bold";

      case TextVariants.Subtitle:
        return `text-Pri-Dark text-medium font-semibold ${customCss}`;

      case TextVariants.MediumSubtitle:
        return `text-medium font-medium ${customCss}`;

      case TextVariants.SmallText:
        return `text-sm font-medium ${customCss}`;

      default:
        return "text-base font-normal";
    }
  };

  return <div className={getClassName()}>{data}</div>;
};

export default Texts;
