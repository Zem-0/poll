/* eslint-disable @next/next/no-img-element */
import Text from "@/components/ui/Texts/Text";
import React from "react";

interface PageProps {
  intro: boolean;
  toogleIntro: any; //
  introductions: Introductions;
  startPoll: boolean;
}

type Introductions = {
  title: string;
  instruction: string;
  introduction: string;
  totalquestion: string;
  totaltime: string;
};

const Instructions: React.FC<PageProps> = ({
  intro,
  toogleIntro,
  introductions,
  startPoll,
}) => {
  return (
    <>
      <div
        className={`${
          intro === true
            ? "transform rotate-0 duration-500 md:translate-x-[-24rem] translate-y-[0.2rem] ] 2xl:translate-x-[-26rem] shadow-none h-full"
            : "-rotate-6 h-[90%] hidden lg:block"
        } absolute bg-white w-full overflow-scroll no-scrollbar  p-6 transition-transform rounded-2xl z-50 lg:z-20 tansform origin-bottom block shadow-2xl`}
        // } bg-white w-full h-full overflow-hidden md:h-5/6 lg:w-1/5 xl:w-1/4 2xl:w-1/5  xl:h-4/6 2xl:h-3/4 p-6 transition-transform rounded-xl translate-y-[-2rem] absolute z-50 tansform origin-bottom  hidden xl:block shadow-2xl`}
      >
        <div className="flex flex-row">
          {startPoll === true && intro == false && (
            <div>
              <button
                onClick={() => {
                  toogleIntro();
                }}
                className=" text-start"
              >
                <img src="/images/conversation/introduction.svg" alt="" />
              </button>
            </div>
          )}
        </div>

        {intro == true && (
          <>
            <div aria-hidden="true">
              <div className="relative flex flex-row gap-2 items-center">
                <div className="flex flex-row">
                  <div>
                    <img src="/images/respondent/question.svg" alt="icon" />
                  </div>
                  <div className="pl-2 text-exsm font-medium text-Golden">
                    {introductions?.totalquestion} ques
                  </div>
                </div>
                <div className="flex flex-row">
                  <div>
                    <img src="/images/respondent/time.svg" alt="icon" />
                  </div>
                  <div className="pl-2 text-exsm font-medium text-Golden">
                    {introductions?.totaltime} mins
                  </div>
                </div>
                <div
                  className=" cursor-pointer p-2 bg-gray-100 rounded-full ml-auto hover:rotate-45 transition-all"
                  onClick={() => {
                    toogleIntro();
                  }}
                >
                  <img src="/images/cross.svg" alt="icon" />
                </div>
              </div>
            </div>
            <Text
              variant="h2"
              extraCSS="text-[#183D81] capitalize font-medium my-4 leading-9"
            >
              {introductions.title || "Survey Title"}
            </Text>

            {/* <div className="w-12 h-12 my-2">
              <img src="/Squircle.svg" alt="" />
            </div> */}

            <div className="text-Pri-Dark text-msm font-normal">
              <p className="text-[16px] font-normal leading-[22px] text-[#183D81]">
                <span className="mb-2 block">Hi!</span>
                {introductions.introduction
                  ? introductions.introduction.length > 150
                    ? introductions.introduction.slice(0, 150) + "..."
                    : introductions.introduction
                  : "No introduction provided"}
              </p>
              <p className="text-[16px] font-normal leading-[22px] text-[#183D81] my-2">
                This survey should take about {introductions?.totaltime}{" "}
                minutes.
              </p>
            </div>

            {/* <div className="flex flex-col justify-center w-full gap-3 ">
              <p className="text-[#183D81]">Acme Ventures</p>
              <div>
                <div className="flex flex-row justify-start">
                  <button className="mr-2 hover:rotate-12 active:scale-90">
                    <img
                      src="/images/Attachment.svg"
                      alt=""
                      className="bg-gray-100 h-10 w-10 border rounded-full p-2 outline-none border-none"
                    />
                  </button>
                  <button className="mr-2 hover:rotate-12 active:scale-90">
                    <img
                      src="/images/ri_facebook-fill.svg"
                      alt=""
                      className="bg-gray-100 h-10 w-10 border rounded-full p-2 outline-none border-none"
                    />
                  </button>
                  <button className="mr-2 hover:rotate-12 active:scale-90">
                    <img
                      src="/images/ri_linkedin-fill.svg"
                      alt=""
                      className="bg-gray-100 h-10 w-10 border rounded-full p-2 outline-none border-none"
                    />
                  </button>
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>

      {intro === false && startPoll === true && (
        <div className="absolute z-10 w-40 hidden xl:block -left-[62%] top-8">
          <img src="/a.png" alt="" />
        </div>
      )}
    </>
  );
};

export default Instructions;
