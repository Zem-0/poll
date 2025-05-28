/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { FaAngleRight } from "react-icons/fa6";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import Confetti from "confetti-react";
import { RiDownloadCloudFill } from "react-icons/ri";
import {
  getInstructions,
  getFirstQuestion,
  getNextQuestion,
  sendFeedback,
  recordSurveyVisit,
} from "@/app/api/conversation/conversation";
import { Question } from "@/app/types/Conversation/Conversation_Types";
import { QuestionTypes } from "@/constants/enums/QuestionTypes/QuestionTypes";
import {
  prevConversation,
  setSurveyCode,
  startTheConversation,
  toogleConversationType,
} from "@/lib/features/conversation/conversationSlice";
import { RootState } from "@/lib/store";

import Instructions from "./components/Instructions";
import Preference from "./components/Preference";
import Reference from "./components/Reference";
import SpeechComponent from "./components/SpeechComponent";
import Link from "next/link";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { CheckRegistraction } from "@/app/api/auth";
import ChatLoader from "@/components/ChatLoader";
import WaitlistForm from "./components/WaitlistForm";
import RenderRating from "@/app/polls/[pollid]/components/RatingComponent/RenderRating";
import ConversationInput from "./components/ConversationInput";
import AttachmentComponent from "./components/AttachmentComponent";
import MobileSideMenu from "./components/MobileSideMenu";
import ConversationQuestionComponent from "./components/ConversationQuestionComponent";

interface PageProps {
  params: any;
}

type Introductions = {
  title: string;
  instruction: string;
  introduction: string;
  totalquestion: string;
  totaltime: string;
};

const Page: React.FC<PageProps> = ({ params }) => {
  const dispatch = useDispatch();

  const conversation = useSelector((state: RootState) => state.conversation);
  //this is for mobile phone
  const [activeLink, setActiveLink] = useState<string>("poll");
  const [conversationHistory, setConversationHistory] = useState<Question[]>(
    []
  );
  const [freeTextAnswer, setFreeTextAnswer] = useState("");
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [uniqueId, setUniqueId] = useState<string>(uuidv4());
  const [questionType, setQuestionType] = useState<string>("");
  const [skipable, setSkipable] = useState<boolean>(false);
  const [noMoreText, setNoMoreText] = useState<boolean>(false);
  const [startPoll, setStartPoll] = useState<boolean>(false);
  const [intro, setIntro] = useState(false);
  const [profile, setProfile] = useState(false);
  const [feedBack, setFeedback] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isStartPollLoading, setIsStartPollLoading] = useState(false);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [isInputBtnLoading, setIsInputBtnLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null); // Reference for the scrollable container
  const [newMessageLoading, setnewMessageLoading] = useState(false);
  const [attachment, setAttachment]: any = useState(null);
  const [isAssestPopupOpen, setIsAssestPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const feedBacks = [
    { name: "loved", value: "Loved it", icon: "❤️❤️", selectedIcon: "🤍🤍" },
    { name: "liked", value: "Liked it", icon: "😊", selectedIcon: "😊" },
    { name: "disliked", value: "Boo...", icon: "😫", selectedIcon: "😫" },
  ];
  const [introductions, setIntroductions] = useState<Introductions>({
    title: "",
    instruction: "",
    introduction: "",
    totalquestion: "",
    totaltime: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [stopSurvey, setStopSurvey] = useState(false);

  useEffect(() => {
    setUniqueId(uuidv4());
  }, []);

  useEffect(() => {
    async function GetInstructions() {
      try {
        const response = await getInstructions(
          params.conversation_id,
          uniqueId
        );

        if (response?.status == 200) {
          setIntroductions(response.data);
        }
        dispatch(setSurveyCode({ survey_code: params.conversation_id }));
      } catch (err) {
        console.log(err);
      }
    }
    GetInstructions();
  }, [dispatch, params.conversation_id, uniqueId]);

  useEffect(() => {
    const recordVisit = async () => {
      // Get or create visitor ID from localStorage
      let visitorId = localStorage.getItem("pollvault_visitor_id");
      if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem("pollvault_visitor_id", visitorId);
      }

      try {
        await recordSurveyVisit(params.conversation_id, visitorId);
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };

    recordVisit();
  }, [params.conversation_id]); // Only run when conversation_id changes

  async function startConversation() {
    setIsStartPollLoading(true);
    const visitorId = localStorage.getItem("pollvault_visitor_id") || uniqueId;

    try {
      const response = await getFirstQuestion(
        params.conversation_id,
        visitorId
      );

      if (response?.status == 200) {
        setQuestionType(
          response?.data.type === QuestionTypes.MCQ
            ? QuestionTypes.MCQ
            : response?.data.type === QuestionTypes.RATING
            ? QuestionTypes.RATING
            : QuestionTypes.FREE_TEXT
        );
        setRemainingTime(parseInt(response.data.total_time));
        dispatch(startTheConversation({ current_question: response.data }));

        if (response.data.has_attachment) {
          setAttachment(response.data.attachment);
        } else {
          setAttachment(null);
        }

        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_PORT}/record-survey-visit/${params.conversation_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "visitor-id": visitorId,
              "visit-type": "start",
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStartPollLoading(false);
      setStartPoll(true);
    }
  }

  async function NextQuestion(skip: boolean = false) {
    setIsSubmitBtnLoading(true);
    setIsInputBtnLoading(true);

    try {
      const response = await getNextQuestion(
        freeTextAnswer,
        conversation.currentQuestion
      );

      if (response.data.has_attachment) {
        setAttachment(response.data.attachment);
      } else {
        setAttachment(null);
      }

      if (response?.data.type === QuestionTypes.MCQ) {
        setQuestionType(QuestionTypes.MCQ);
      } else if (response?.data.type === QuestionTypes.RATING) {
        setQuestionType(QuestionTypes.RATING);
      } else {
        setQuestionType(QuestionTypes.FREE_TEXT);
      }

      if (response?.status == 200) {
        if (response.data.message === "No more questions available") {
          setNoMoreText(true);
          // window.location.href = "/thanks";
        }
        if (response.data.skipquestion === true) {
          setSkipable(true);
        } else {
          setSkipable(false);
        }

        dispatch(prevConversation({ current_question: response?.data }));

        if (skip === false) {
          const current = {
            ...conversation.currentQuestion.current_question,
            answer: freeTextAnswer,
            ratingValue,
            attachment: attachment ? attachment : null,
          };

          setConversationHistory((prevHistory) => [...prevHistory, current]);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedOptions([]);
      setIsSubmitBtnLoading(false);
      setIsInputBtnLoading(false);
      setFreeTextAnswer("");
      setRatingValue(0);

      // Trigger fake loading for the next question
      setnewMessageLoading(true); // Show loader
      setTimeout(() => {
        setnewMessageLoading(false); // Hide loader after 2 seconds
      }, 1500);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000 * 60);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); //

  function toogleIntro() {
    setIntro((prev) => !prev);
    if (menuOpen) setMenuOpen(false);
  }

  function toogleProfile() {
    setProfile((prev) => !prev);
    if (menuOpen) setMenuOpen(false);
  }

  const handleOptionClick = (selectedOption: string) => {
    // If the option is already selected, remove it
    if (selectedOptions.includes(selectedOption)) {
      const newSelectedOptions = selectedOptions.filter(
        (option) => option !== selectedOption
      );
      setSelectedOptions(newSelectedOptions);
      setFreeTextAnswer(newSelectedOptions.join(", "));
    } else {
      const maxChoices =
        conversation.currentQuestion.current_question?.max_no_of_choices || 1;

      // If the limit is 1, replace the current selection with the new one
      if (maxChoices === 1) {
        setSelectedOptions([selectedOption]);
        setFreeTextAnswer(selectedOption);
      } else if (selectedOptions.length < maxChoices) {
        // If the limit allows more selections, add the new one
        const newSelectedOptions = [...selectedOptions, selectedOption];
        setSelectedOptions(newSelectedOptions);
        setFreeTextAnswer(newSelectedOptions.join(", "));
      }
    }
  };

  async function handleFeedback(feedback: string) {
    setFeedback(feedback);
    setShowConfetti(true);

    // Automatically reset confetti after 4 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    try {
      const response = await sendFeedback(
        params.conversation_id,
        uniqueId,
        feedback
      );
      if (response?.status == 200) {
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setShowPopup(true);
    }
  }

  const restartSurvey = () => {
    window.location.reload();
  };

  const toggleMenu = () => {
    setMenuOpen((pre) => !pre);
  };

  // Function to determine if the asset is an image
  // const isImageAsset = (url : any) => {
  //   return url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  // };
  const isImage = (contentType: any) => {
    return typeof contentType === "string" && contentType.startsWith("image/");
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (conversationEndRef.current) {
        conversationEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // 🚀 Ensure that scrolling happens **after** the DOM updates
    const timeoutId = setTimeout(() => {
      scrollToBottom();

      // ✅ Additional check: If the scroll missed the bottom, retry after 300ms
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }, 150); // 150ms delay before scrolling

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [conversationHistory, conversation.currentQuestion, newMessageLoading]);

  //check for login
  useEffect(() => {
    const checkLogin = async () => {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        try {
          const isValid = await CheckRegistraction(access_token); // Ensure this is async
          setIsLogIn(isValid);
        } catch (error) {
          console.error("Error validating access token:", error);
          setIsLogIn(false);
        }
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      {/* {startPoll == true && <Preference />} */}
      <div className="min-h-svh relative md:bg-Neutral  flex flex-col  overflow-hidden">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            gravity={0.3}
            recycle={false}
            numberOfPieces={400}
            style={{
              zIndex: 100,
            }}
          />
        )}

        <div className="w-full hidden lg:flex flex-row px-5 lg:px-8 py-5 justify-between">
          <Link href={"/"}>
            <div className="w-[140px]">
              <img src="/pollvault.svg" alt="icon" />
            </div>
          </Link>
          {/* <div className="relative flex flex-row gap-2 items-center justify-center">
            <Link href="/signup" target="_blank">
              <Text variant="body13R" extraCSS="text-primaryBlue">
                Sign in
              </Text>
            </Link>
            <span className="w-[2px] h-[20px] bg-gray-400 rounded-3xl"></span>
            <Text variant="body13R" extraCSS="text-textGray">
              New here?
            </Text>
            <Link href="/signup" target="_blank">
              <Text variant="body13R" extraCSS="text-primaryBlue">
                Sign up
              </Text>
            </Link>
          </div> */}
        </div>

        <div className="w-full h-svh lg-h-full flex flex-1 items-center justify-center ">
          {/* <div className="relative w-full h-auto lg:w-1/3 xl:w-1/4 2xl:w-1/5 "> */}
          <div className="relative w-full h-svh lg:h-auto lg:w-1/5 lg:max-w-[400px] lg:min-w-[350px]">
            <Instructions
              intro={intro}
              toogleIntro={toogleIntro}
              introductions={introductions}
              startPoll={startPoll}
            />

            {conversation.conversation_type === "text" ? (
              <>
                <div className="relative z-30 shadow-xl bg-[#ffffff] w-full flex flex-col gap-2 justify-between h-svh lg:h-[650px]  overflow-hidden p-5 lg:rounded-2xl lg:translate-y-[-2rem] lg:border lg:border-Yellow">
                  {/* for restarting the survey */}
                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
                      <div className="relative bg-white rounded-lg shadow-lg p-6 pt-4 w-[85%]">
                        {/* Close Icon */}
                        <button
                          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                          onClick={() => setShowPopup(false)} // Close the popup
                        >
                          <FaTimes size={18} />
                        </button>

                        <h2 className="text-lg font-bold text-[#183D81]">
                          Restart Survey
                        </h2>
                        <p className="text-sm text-gray-600 my-2">
                          Would you like to restart the survey and share more
                          insights?
                        </p>
                        <Button
                          type="gradient"
                          label="Restart Survey"
                          onClick={restartSurvey}
                          customCss=""
                        />
                      </div>
                    </div>
                  )}

                  {stopSurvey && (
                    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-[85%]">
                        <h2 className="text-lg font-bold text-[#183D81]">
                          End Survey
                        </h2>
                        <p className="text-sm text-gray-600 my-2">
                          Leaving so soon 🙁!! If you can spare a minute, I have
                          just 2 more questions for you.
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-4">
                          <Button
                            type="primaryWhite"
                            label="End"
                            customCss=""
                            onClick={restartSurvey}
                          />
                          <Button
                            type="gradient"
                            label="Continue"
                            onClick={() => setStopSurvey(false)}
                            customCss=""
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {startPoll == false ? (
                    <>
                      <div>
                        <div>
                          <div aria-hidden="true">
                            <div className="relative flex flex-row gap-2 items-center">
                              <div className="lg:hidden">
                                <img src="/purpleSmallLogo.svg" alt="icon" />
                              </div>
                              <div className="flex flex-row ml-auto lg:ml-0">
                                <div>
                                  <img
                                    src="/images/respondent/question.svg"
                                    alt="icon"
                                  />
                                </div>
                                <div className="pl-2 text-exsm  text-Golden">
                                  {introductions?.totalquestion || 0} ques
                                </div>
                              </div>
                              <div className="flex flex-row">
                                <div>
                                  <img
                                    src="/images/respondent/time.svg"
                                    alt="icon"
                                  />
                                </div>
                                <div className="pl-2 text-exsm text-Golden">
                                  {introductions?.totaltime || 0} mins
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Text
                        variant="h2"
                        extraCSS="text-[#183D81] capitalize font-medium my-3 leading-9"
                      >
                        {introductions.title || "Welcome to Survey!"}
                      </Text>

                      <div className="text-Pri-Dark text-msm font-normal">
                        <p className="text-[16px] font-normal leading-[22px] text-[#183D81]">
                          <span className="mb-2 block">Hi!</span>
                          {introductions.introduction
                            ? introductions.introduction.length > 150
                              ? introductions.introduction.slice(0, 150) + "..."
                              : introductions.introduction
                            : "We're excited to hear from you."}
                        </p>
                        <p className="text-[16px] font-normal leading-[22px] text-[#183D81] my-2">
                          This survey should take about some{" "}
                          {introductions?.totaltime} minutes let's begin! ✨.
                        </p>
                      </div>

                      {/* social media links */}
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

                      <div className="w-full flex flex-col flex-grow justify-end ">
                        {/* <button className="w-full text-center p-4 font-normal text-normal text-Golden mb-2 hover:text-Normal-Blue ">
                          I have only 5 mins {">>"}
                        </button> */}
                        <div className="bg-[#FFFAF0] lg:relative">
                          <Button
                            label="Start"
                            type="gradient"
                            customCss="bg-red-300 rounded-xl w-full"
                            onClick={() => {
                              startConversation();
                            }}
                            clickAnimation={true}
                            loading={isStartPollLoading}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" flex flex-row items-center justify-between">
                        <div
                          className="cursor-pointer lg:hidden"
                          onClick={toggleMenu}
                        >
                          <img
                            src="/images/conversation/menuIcon.svg"
                            alt="icon"
                          />
                        </div>
                        <div className="flex items-center ">
                          <div className="flex-shrink-0 w-[100px] overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-Golden"
                              style={{
                                width: `${noMoreText ? "100%" : conversation.currentQuestion?.current_question?.completion || 0}`,
                              }}
                            />
                          </div>
                          <div className="ml-2 text-Golden">
                            {noMoreText ? (
                              <p className="text-Golden text-exsm font-medium flex items-center justify-center">
                                100%{" "}
                                <span className="px-2 font-bold text-2xl">
                                  ·
                                </span>{" "}
                                0 min
                              </p>
                            ) : (
                              <>
                                <p className="text-Golden text-exsm font-medium flex items-center justify-center">
                                  {Math.round(
                                    parseInt(
                                      conversation.currentQuestion
                                        ?.current_question?.completion
                                    )
                                  ) || 0}
                                  %{" "}
                                  <span className="px-2 font-bold text-2xl">
                                    ·
                                  </span>{" "}
                                  {remainingTime} min
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          className=" cursor-pointer p-1.5 bg-red-100 rounded-md lg:ml-auto"
                          onClick={() => setStopSurvey(true)}
                        >
                          <img src="/images/conversation/go.svg" alt="icon" />
                        </button>
                      </div>
                      <div
                        ref={scrollableContainerRef}
                        className="overflow-y-scroll no-scrollbar pt-4"
                      >
                         {/* Render previous conversation history */}
                        {conversationHistory.map((item, index) => (
                          <div key={index}>
                            <div className="flex flex-col gap-2 h-full">
                              <div className="w-[44px] flex justify-start items-end">
                                <img src="/images/conversation/Squircle.png" alt="icon" />
                              </div>
                              <div className="w-full text-[16px] font-normal leading-[22px] text-[#183D81]">
                                {item.question}
                              </div>
                            </div>

                            {/* Render attachments if available */}
                            <AttachmentComponent attachment={item.attachment} />

                            {/* Render different question types */}
                            {item.answer && (item.type === QuestionTypes.FREE_TEXT ||  item.type === QuestionTypes.MCQ ) && (
                              <div className="mt-3 mb-3 flex flex-row h-full justify-end">
                                <div className="w-max py-2 text-[#183D81] text-end bg-[#FFEFCB] rounded-xl px-4 rounded-br-none">
                                  {item.answer}
                                </div>
                              </div>
                            )}

                            {item.type === QuestionTypes.RATING && (
                              <div className="mt-3 mb-6 w-[220px] ml-auto">
                                <RenderRating
                                  selectedFormat={item.rating_type}
                                  ratingValue={item.ratingValue}
                                  setRatingValue={() => {}}
                                  itemCount={item.rating_scale?.max}
                                  readOnly={true}
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* new message */}
                        {newMessageLoading && noMoreText === false ? (
                          <ChatLoader />
                        ) : (
                          conversation.currentQuestion.current_question?.type && ( // ✅ Check if type exists before rendering
                            <ConversationQuestionComponent
                              question={conversation.currentQuestion.current_question}
                              selectedOptions={selectedOptions}
                              handleOptionClick={handleOptionClick}
                              ratingValue={ratingValue}
                              setRatingValue={setRatingValue}
                            />
                          )
                        )}

                        {/* poll end message */}
                        {noMoreText === true && (
                          <div className="my-2 w-full flex items-center justify-center flex-col gap-4">
                            <div className="flex flex-col gap-2 h-full">
                              <div className="w-[44px] flex justify-start items-end">
                                <img
                                  src="/images/conversation/Squircle.png"
                                  alt=""
                                />
                              </div>
                              <p className="w-full text-[16px] font-normal leading-[22px] text-[#183D81]">
                                Thank you so much for your time today! I know it
                                ended up being a bit longer survey, but I really
                                appreciate your insights. ☺️
                              </p>
                            </div>
                            <div className="w-full flex items-center justify-center">
                              <img
                                className="w-[55%] mx-auto"
                                src="/images/conversation/flagCompleteIcon.svg"
                                alt="flagIcon"
                              />
                            </div>
                            <div className="flex w-5/6 flex-col py-6  items-center">
                              <div className="flex w-full flex-row justify-between gap-2">
                                {feedBacks.map((item, index) => (
                                  <div key={item.name}>
                                    <button
                                      key={item.name}
                                      className={`${
                                        item.name === feedBack
                                          ? "bg-gradient-to-br from-Purple-Grad-Dark-900 to-Purple-Grad-Dark-500 text-white"
                                          : ""
                                      } border border-gray-300 flex flex-col items-center justify-center flex-1 rounded-lg  hover:bg-[#FFEFCB] hover:outline-none p-2 `}
                                      onClick={() => {
                                        handleFeedback(item.name);
                                      }}
                                    >
                                      <div className="text-medium font-normal">
                                        {item.value}
                                      </div>
                                      <div>
                                        {feedBack == item.name
                                          ? item.selectedIcon
                                          : item.icon}
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* divider */}
                            <div className="relative w-full h-[4px] rounded-full overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
                              {/* Moving Gradient Effect */}
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 divider-animate-slide"></div>
                            </div>
                            {/* divider */}
                            <div className="flex w-5/6 flex-col py-6  items-center">
                              <WaitlistForm
                                onSuccess={() => {
                                  setShowConfetti(true); // Show confetti immediately
                                  setTimeout(() => {
                                    setShowPopup(true); // Show popup after 2 seconds
                                    setShowConfetti(false);
                                  }, 5000);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Add an invisible element at the end to scroll to */}
                        <div ref={conversationEndRef} />
                      </div>

                      {/* conversation buttons */}
                      {questionType === QuestionTypes.MCQ || questionType === QuestionTypes.RATING ? (
                        <>
                          <div className="w-full grow flex flex-col items-center justify-end">
                            {skipable && (
                              <button
                                className=" text-blue-800 font-medium p-2 my-2 text-center"
                                onClick={() => {
                                  NextQuestion(true);
                                }}
                              >
                                skip question {">>"}
                              </button>
                            )}

                            <Button
                              label="Submit"
                              onClick={() => {
                                NextQuestion();
                              }}
                              type="gradient"
                              fullWidth={true}
                              disabled={questionType === QuestionTypes.MCQ ? selectedOptions.length === 0 : ratingValue === 0}
                              loading={isSubmitBtnLoading}
                              customCss="rounded-xl"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="w-full grow flex flex-col items-center justify-end">
                          {skipable === true && (
                            <button
                              className=" text-Golden my-2 text-center font-medium p-2"
                              onClick={() => {
                                NextQuestion(true);
                              }}
                            >
                              skip question {">>"}
                            </button>
                          )}
                          {!noMoreText && (
                            <ConversationInput isInputBtnLoading={isInputBtnLoading} freeTextAnswer={freeTextAnswer} setFreeTextAnswer={setFreeTextAnswer}  NextQuestion={NextQuestion}/>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <SpeechComponent
                  question_type={
                    conversation.currentQuestion.current_question.type
                  }
                  conversation_id={params.conversation_id}
                  unique_id={uniqueId}
                />
              </>
            )}

            <Reference profile={profile} toogleProfile={toogleProfile} />
          </div>
        </div>
        {/* mobile side menu */}
        <MobileSideMenu
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          toogleIntro={toogleIntro}
          toogleProfile={toogleProfile}
          isLogIn={isLogIn}
        />
      </div>
    </>
  );
};

export default Page;
