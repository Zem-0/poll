/* eslint-disable @next/next/no-img-element */
import { AnalysisPollDataType } from "@/app/api/api_types/analysisPoll_types";
import React, { useState } from "react";

interface BasicProps {
  formData: AnalysisPollDataType; // Replace 'any' with the appropriate type for formData
  handleFormDataChange: (newValue: any) => void; // Replace 'any' with the appropriate type for the value
  setFormData: React.Dispatch<React.SetStateAction<AnalysisPollDataType>>;
}

const KnowledgeBase: React.FC<BasicProps> = ({
  formData,
  handleFormDataChange,
  setFormData,
}) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = () => {};
  
  return (
    <>
      <div className="flex flex-col gap-10">
        <div>
          <label
            htmlFor="cover-photo"
            className="block text-sm font-medium leading-6 text-Pri-Dark"
          >
            Upload responses, notes, and additional context
          </label>

          <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed text-Pri-Dark px-6 py-10">
            <div className="text-center flex flex-col gap-2">
              <div className=" flex justify-center">
                <img
                  src="/images/workspace/upload_file.svg"
                  alt=""
                  className="w-8 h-auto"
                />
              </div>

              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold  text-Normal-Blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 hover:text-Normal-Blue"
                >
                  <span className="">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>

              {fileName === "" && (
                <p className="text-xs leading-5 text-gray-600">
                  Text or Word file
                </p>
              )}
              {fileName !== "" && (
                <div className="text-xs w-5/6 px-2  py-1 text-gray-600 bg-blue-200 rounded-xl flex flex-row gap-1 justify-around">
                  <span>{fileName}</span>
                  <span>✕</span>
                </div>
              )}
            </div>
          </div>

          <div className=" text-center text-gray-400 text-base mt-2">
            You can upload up to 10 files of up to 10mb in size (total)
          </div>

          <p className="my-4 text-sm font-thin">
            <span className="font-bold">Note: </span> You can upload PDFs, Word
            or Text files of exported results from SurveyMonkey, Google Forms,
            etc., and other relevant content, such as org charts, interview
            notes, your ideal responses, etc.
          </p>

        </div>

        <div>
          <label
            htmlFor="customInstructions"
            className="text-base font-medium leading-6 text-Pri-Dark flex items-center gap-2"
          >
            Set custom instructions 
            <img src="/images/workspace/info.svg" alt="info" />
          </label>
          <div className="mt-2">
            <textarea
              id="customInstructions"
              name="customInstructions"
              autoComplete="off"
              required
              rows={3}
              value={formData.customInstructions}
              className="block w-full rounded-md py-2 px-2.5  border-2 border-Gray-Background outline-none  placeholder:text-gray-400 focus:border-yellow-500 sm:text-sm sm:leading-6"
              placeholder="Add custom instructions..."
              onChange={(e) => handleFormDataChange(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBase;
