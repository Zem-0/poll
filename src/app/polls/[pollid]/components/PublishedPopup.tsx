"use client";

import Button from '@/components/ui/buttons/Button';
import Text from '@/components/ui/Texts/Text';
import { closeSurveyPublished } from '@/lib/features/workspace/outlineSlice';
import { RootState } from '@/lib/store';
import React, { useState } from 'react'
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';

const PublishedPopup = () => {
    const dispatch = useDispatch();
    const outlineSlice = useSelector((state: RootState) => state.outline);
      const [data, setData] = useState({
        survey_link: outlineSlice.survey_link,
        unique_link: outlineSlice.unique_link,
      });


      const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand("copy");
          
        } catch (err) {
          console.error("Fallback: Unable to copy", err);
        }
        document.body.removeChild(textArea);
      };

    const copyToClipboard = async (name: string) => {
        const text =
          name === "survey_link"
            ? data.survey_link
            : data.unique_link;
     
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(text);
          } catch (err) {
            fallbackCopyTextToClipboard(text);
          }
        } else {
          fallbackCopyTextToClipboard(text);
        }
      };  
    
  return (
    <>
    <div className="backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
      <div className="w-[90%] max-w-[450px] relative my-6 mx-auto  bg-Almost-White p-5 rounded-xl flex flex-col justify-center">
        <div className="flex flex-row my-2 gap-2 justify-between items-center ">
          <Text variant="h3">Your poll has been published!! 🥳</Text>
          <button
            className=" flex flex-row justify-end hover:rotate-90 transition-transform"
            onClick={() => dispatch(closeSurveyPublished())}
          >
            <img src="/images/polls/cross.svg" alt="icon" />
          </button>
        </div>
        <div className="flex flex-row">
          <div className="w-full p-4">
            <div className="flex gap-5 w-3/4 border-b border-Gray-Background">
              <button
                className="border-b-2 px-2 border-Purple-Border font-semibold text-medium text-Normal-Blue"
                // onClick={() => {
                //   setSurvey("link");
                // }}
              >
                Link & code
              </button>
              {/* <button
                className={`${survey === "messaging" ? "border-b-2 border-Purple-Border font-semibold text-Normal-Blue" : ""}`}
                onClick={(e) => {
                  setSurvey("messaging");
                }}
              >
                Messaging
              </button> */}

              <button
                className="text-Lt-Gray cursor-not-allowed  font-medium text-medium"
                // onClick={() => {
                //   setSurvey("messaging");
                // }}
              >
                Messaging
              </button>
            </div>
            <div className="mb-6 mt-12 flex flex-col gap-1">
              <Text variant="body15R">Survey link</Text>
              <div className=" flex flex-row">
                <input
                  type="text"
                  name="surveyLink"
                  id="surveyLink"
                  value={data.unique_link}
                //   value={`http://52.151.192.12:3000/conversation/${data.survey_link}`}
                  className="block w-full h-12 border border-Gray-Background rounded-l-md  text-gray-900   placeholder:text-gray-400 outline-none  sm:text-sm sm:leading-6 p-4 font-medium"
                  readOnly
                />

                <button
                  onClick={() => {
                    copyToClipboard("unique_link");
                  }}
                  className=" px-4 h-12 bg-Neutral  text-white rounded-r-md  hover:bg-gray-400 active:scale-95"
                >
                  <img src="/images/workspace/copy.svg" alt="" />
                </button>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-1">
              <Text variant="body15R">Unique code</Text>
              <div className="flex flex-row">
                <input
                  type="text"
                  name="link"
                  id="link"
                  value={data.survey_link}
                  className="block w-full h-12 rounded-l-md  border bg-white border-Gray-Background text-gray-900 placeholder:text-gray-400 outline-none  sm:text-sm sm:leading-6 p-4 font-medium"
                  readOnly
                />

                <button
                  onClick={() => {
                    copyToClipboard("survey_link");
                  }}
                  className=" px-4 h-12 bg-Neutral  text-white rounded-r-md  hover:bg-gray-400 active:scale-95"
                  name="link"
                >
                  <img src="/images/workspace/copy.svg" alt="" />
                </button>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center">
              <div className=" text-base font-medium">QR code</div>
              <div className="flex flex-row gap-4">
                {/* <img
                  src="/images/polls/qr_code.png"
                  alt=""
                  className="w-32 h-auto"
                /> */}
                <div className="bg-white p-4 rounded-md">
                  <QRCode value={data.unique_link} size={128} />
                </div>
                <div className=" flex items-center">
                  <button
                    onClick={() => {
                      copyToClipboard("survey_link");
                    }}
                    className=" px-4 h-12 bg-Neutral  text-white rounded-xl   border-2 focus:border-yellow-500"
                  >
                    <img src="/images/workspace/copy.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-12 gap-2 ">
          <Button
            type="primaryWhite"
            label="Cancel"
            onClick={() => dispatch(closeSurveyPublished())}
          />
          <Button
            type="primaryBlack"
            label="Go"
            onClick={() => {
              dispatch(closeSurveyPublished()); // Close the modal
              window.open(data.unique_link, "_blank"); // Navigate to the next tab with the survey link
            }}
          />
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
  )
}

export default PublishedPopup