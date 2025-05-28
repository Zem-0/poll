/* eslint-disable @next/next/no-img-element */
import React from "react";
import Button from "../ui/buttons/Button";

const PlatformSignup = () => {
  return (
    <>
      <div className="flex flex-row justify-center md:justify-start gap-3">
        <Button
          type="primaryWhite"
          iconSrc="/linkedin.svg"
          iconHoverSrc="/linkedinWhite.svg"
        />
        <Button
          type="primaryWhite"
          iconSrc="/facebook.svg"
          customCss="border-red"
          iconHoverSrc="/facebookWhite.svg"
        />
        <Button
          type="primaryWhite"
          iconSrc="/google.svg"
          iconHoverSrc="/googleWhite.svg"
        />
      </div>
    </>
  );
};

export default PlatformSignup;
