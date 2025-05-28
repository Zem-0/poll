import Link from "next/link";
import React from "react";
import Text from "../ui/Texts/Text";

const Privacy = () => {
  return (
    <>
      <div>
        <div className="text-Pri-dark text-msm">
          <Text variant="body13R" extraCSS="text-textGray">
            By continuing you agree with our
            <Link className=" text-Golden  font-semibold px-1" href="/">
              Privacy Policy
            </Link>
            and
            <Link className="text-Golden px-1 font-semibold" href="/">
              Terms of Service
            </Link>
          </Text>
        </div>
      </div>
    </>
  );
};

export default Privacy;
