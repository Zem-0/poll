/* eslint-disable @next/next/no-img-element */
import React from "react";

interface PageProps {
  profile: boolean;
  toogleProfile: any; //
}

const Reference: React.FC<PageProps> = ({ profile, toogleProfile }) => {
  return (
    <>
      <div
        className={`${
          profile === true
            ? "transform rotate-0 duration-500 md:translate-x-[24rem] lg:translate-y-[0.2rem]  2xl:translate-x-[26rem] shadow-none h-full"
            : "rotate-6 translate-y-8 h-[90%] hidden lg:flex"
        } absolute bg-white w-full overflow-scroll no-scrollbar  p-6 transition-transform rounded-2xl  top-0 lg:top-4  z-50 lg:z-20 tansform origin-bottom  shadow-2xl flex flex-col gap-4`}
        // } bg-white w-full h-full overflow-scroll no-scrollbar md:h-5/6 lg:w-1/5 xl:w-1/4 2xl:w-1/5   p-6 transition-transform rounded-xl translate-y-[-2rem] absolute z-20 tansform origin-bottom  hidden  shadow-2xl xl:flex flex-col gap-4`}
      >
        {profile == true ? (
          <button
            className=" cursor-pointer p-2 bg-gray-100 rounded-full ml-auto hover:rotate-45 transition-all"
            onClick={() => {
              toogleProfile();
            }}
          >
            <img src="/images/cross.svg" alt="icon" />
          </button>
        ) : (
          <button
            onClick={() => {
              toogleProfile();
            }}
            className={`flex flex-row  w-full justify-end`}
          >
            <img
              src="/images/conversation/reference.svg"
              alt=""
              className="transform "
            />
          </button>
        )}

        {profile == true && (
          <>
            <img
              src="https://static.vecteezy.com/system/resources/previews/017/774/158/large_2x/portrait-of-smiling-beautiful-business-asian-woman-in-pink-suit-working-in-home-office-desk-using-computer-business-people-employee-freelance-online-marketing-e-commerce-work-from-home-concept-photo.jpg"
              alt=""
              className="rounded-xl"
            />
            <div className="font-medium text-Pri-Dark  mt-4 font-sans text-exlg">
              Tips for the best Pollvault experience!
            </div>
            <div className=" text-Pri-Dark  text-medium font-normal">
              <ul className="list-disc px-4 text-msm">
                <li>
                  <span className=" font-bold">
                    {" "}
                    Sign in for a smooth ride.
                  </span>
                  Your preferences and past answers (with your permission!) help
                  us personalize your future polls.
                </li>
                <li>
                  {" "}
                  <span className=" font-bold"> Short on time?</span>
                  No problem! Tap {"'End'"} at the top to wrap up the poll
                  quickly in just a few questions.
                </li>
                <li>
                  <span className=" font-bold">
                    {" "}
                    Curious about the results?
                  </span>
                  Log in to see your answers alongside everyone {"else's"} (if
                  the poll creator allows it).
                </li>
                <li>
                  <span className=" font-bold">
                    {" "}
                    Curious about the results?
                  </span>
                  Give feedback on polls. Did you love a poll? Did something
                  feel confusing? Share your thoughts! Your feedback helps the
                  creators create even better polls and pollvault craft richer
                  experiences.
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      {profile === false && (
        <div className=" absolute z-10 h-64 w-40 hidden xl:block top-28 -right-[62%]">
          <img src="/b.png" alt="" />
        </div>
      )}
    </>
  );
};

export default Reference;
