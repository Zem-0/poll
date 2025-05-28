/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useReducer, useState } from "react";

import { GetStats } from "@/app/api/dashboard/polls";
import { GetResponses } from "@/app/api/Outline/Outline";
import { GetDropOffAmouns } from "@/app/api/Polls/Polls";
import { CompletionData } from "@/app/types/Dashboard/Results";
import { ResponseData } from "@/app/types/Results/Results";
import jsPDF from "jspdf";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import LineChart from "./ResultComponents/LIneChart";
import Overview from "./ResultComponents/Overview";
import Polly from "./Polly";
import { classNames } from "@/static/static_data";
import { toogleChanges } from "@/lib/features/workspace/workSpaceHeaderSlice";
import { useDispatch } from "react-redux";
import MCQQuestion from "./ResultComponents/MCQQuestion";
import FreeTextQuestion from "./ResultComponents/FreeTextQuestion";
import Button from "@/components/ui/buttons/Button";
import ResultsCharts from "./ResultComponents/ResultsCharts";

interface PageProps {
  pollId: any;
}

function reducer(state: any, action: { type: any }) {
  switch (action.type) {
    case "insights":
      return { tab: "insights" };
    case "responses":
      return { tab: "responses" };
    default:
      return state;
  }
}

const exportFormat = [
  { id: 1, name: "Export" },
  { id: 2, name: "CSV" },
  { id: 3, name: "JSON" },
  { id: 4, name: "PDF" },
];

const Results: React.FC<PageProps> = ({ pollId }) => {
  const [responses, setResponses] = useState<ResponseData>({});
  const [selectedExport, setSelectedExport] = useState(exportFormat[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropOffAmounts, setDropOffAmounts] = useState({});
  const [openPolly, setOpenPolly] = useState(false);
  const [key, setKey] = useState(0);
  const [stats, setStats] = useState<CompletionData>({
    ai_time_to_complete: "",
    average_time_to_complete: "",
    completion_rate: "",
    increment_completion_rate: "",
    increment_people_reached: "",
    increment_starts: "",
    people_reached: 0,
    starts: 0,
    status: "",
  });
  const [state, dispatch] = useReducer(reducer, { tab: "insights" });
  const dispatchAction = useDispatch();

  const fetchStats = async () => {
    try {
      const stats = await GetStats(pollId);
      setStats(stats?.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchResponses = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        const response = await GetResponses(access_token, pollId);
        
        if (response?.status === 200) {
          setResponses(response?.data?.data);
          console.log({responses});
          
        }
      }
    } catch (err) {
      console.error("Error fetching responses:", err);
    }
  };

  const fetchDropOffAmounts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await GetDropOffAmouns(token, pollId);
        if (response?.status === 200) {
          setDropOffAmounts(response?.data.drop_off_amounts);
        }
      }
    } catch (err) {
      console.error("Error fetching drop-off amounts:", err);
    }
  };

  function handleTabChange(tab: string) {
    dispatch({ type: tab });
  }

// Function to handle export based on selected format
const handleExport = () => {
  const format = selectedExport.name.toLowerCase();
  if (format === "csv") {
    exportToCSV(responses);
  } else if (format === "json") {
    exportToJSON(responses);
  } else if (format === "pdf") {
    exportToPDF(responses);
  }
};

// const exportToCSV = (data: ResponseData) => {
//   let csvContent = "data:text/csv;charset=utf-8,Question,Answer,Count,Percentage\n";
  
//   Object.keys(data).forEach((key) => {
//     const questionData = data[key];
//     questionData.answers.forEach((answer) => {
//       csvContent += `${questionData.question},${answer.answer},${answer.count},${answer.percentage}\n`;
//     });
//   });

//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", "survey_data.csv");
//   link.click();
// };

const exportToCSV = (data: ResponseData) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  const rows: string[] = [];

  // Header row
  rows.push("Question Type,Question,Answer,Count,Percentage");

  Object.keys(data).forEach((key) => {
    const item = data[key];
    const { question, type = "Unknown", answers = [] } = item;

    if (!question || !Array.isArray(answers)) return;

    if (type === "Free Text") {
      // Free text answers: treat each as a row with answer text only
      answers.forEach((ans) => {
        rows.push(`"${type}","${question}","${ans.answer}",,`);
      });
    } else {
      // MCQ, Rating: include counts and percentages
      answers.forEach((ans) => {
        rows.push(`"${type}","${question}","${ans.answer}",${ans.count ?? ""},${ans.percentage ?? ""}`);
      });
    }
  });

  csvContent += rows.join("\n");

  // Trigger file download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "survey_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const exportToJSON = (data: ResponseData) => {
  const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonContent);
  link.setAttribute("download", "survey_data.json");
  link.click();
};

const exportToPDF = (data: ResponseData) => {
  const doc = new jsPDF();
  let yOffset = 10; // Initial Y offset for positioning text
  const margin = 10; // Margin for the text content

  // Loop through each question and its answers
  Object.keys(data).forEach((key, index) => {
    const questionData = data[key];
    const questionText = `${index + 1}. ${questionData.question}`;

    // Add the question text with proper line breaks if it's too long
    doc.setFontSize(12); // Set font size for question
    const questionLines = doc.splitTextToSize(questionText, 180); // Split question text to fit within page width
    doc.text(questionLines, margin, yOffset);
    yOffset += questionLines.length * 8; // Adjust yOffset after question (line height is ~8)

    // Loop through each answer and format it
    const answersText = questionData.answers
      .map(answer => `${answer.answer} - Count: ${answer.count} - Percentage: ${answer.percentage.toFixed(2)}%`)
      .join("\n");

    // Add the answers text with proper line breaks if it's too long
    doc.setFontSize(10); // Set smaller font size for answers
    const answerLines = doc.splitTextToSize(answersText, 180); // Split answer text to fit within page width
    doc.text(answerLines, margin, yOffset);
    yOffset += answerLines.length * 8; // Adjust yOffset after answers

    // Check if content exceeds the page height and add a new page if needed
    if (yOffset > 270) { // Assuming 270px height leaves some space
      doc.addPage();
      yOffset = 10; // Reset yOffset for the new page
    }
  });

  // Save the generated PDF
  doc.save("survey_data.pdf");
};

  // Fetch all data
  const fetchData = async () => {
    setIsRefreshing(true);
    const promises = [fetchStats(), fetchResponses(), fetchDropOffAmounts()];

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Error in fetching ${
            index === 0
              ? "Stats"
              : index === 1
                ? "Responses"
                : "Drop-Off Amounts"
          }:`,
          result.reason
        );
      }
    });

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [pollId]);

  // Refresh handler
  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <React.Fragment>
      <div className="xl:px-24 bg-Result-bg min-h-screen overflow-y-hidden gap-4 flex flex-col px-4 py-16  pt-12">
        <div className="xl:px-24 text-xl font-normal text-Pri-Dark font-sans">
          Overview
        </div>
        <div className="xl:px-24 mx-auto flex-col flex md:flex-row w-full">
          <Overview stats={stats} />
        </div>

        <div className="xl:px-24 flex mt-4 flex-col gap-6  w-full">
          <div className="flex flex-row gap-6 items-center">
            <button
              className={`${state.tab === "insights" ? " border-Purple-Border text-Normal-Blue border-b-2 font-semibold " : ""} font-medium text-medium`}
              onClick={() => {
                handleTabChange("insights");
              }}
            >
              Insights
            </button>
            <button
              className={`${state.tab === "responses" ? "border-Purple-Border text-Normal-Blue border-b-2 font-semibold " : ""} text-medium  px-1`}
              onClick={() => {
                handleTabChange("responses");
              }}
            >
              Responses{" "}
            </button>

            <div
              className="ml-auto bg-white py-3 px-4 rounded-lg cursor-pointer hover:shadow-md"
              onClick={handleRefresh}
            >
              <img
                src="/images/results/refresh.svg"
                alt="Refresh"
                className={`transition ${
                  isRefreshing ? "opacity-50 animate-spin" : "opacity-100"
                }`}
              />
            </div>
            <div>
              <div className="flex justify-end relative">
                <Listbox
                  value={selectedExport}
                  onChange={setSelectedExport}
                >
                  {({ open }) => (
                    <>
                      {/* Listbox Button */}
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white border border-Gray-Background py-3 pl-4 pr-10 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6">
                        <span className="block truncate">
                          {selectedExport.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>

                      {/* Listbox Options */}
                      <Transition
                        show={open}
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <ListboxOptions className="absolute top-full left-0 z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {exportFormat.map((expFormat) => (
                            <ListboxOption
                              key={expFormat.id}
                              value={expFormat}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-yellow-500 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate"
                                    )}
                                  >
                                    {expFormat.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-yellow-500",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
            <Button 
              label="Download"
              onClick={handleExport}
              clickAnimation={true}
              disabled={selectedExport.name.toLowerCase() === "export"}
            />
          </div>

          {state.tab === "responses" && (
            <>
              {/* Column layout using the odd even concept */}
              {responses && Object.keys(responses).length > 0 ? (
              <div className="w-full flex gap-4">
                {/* First Column */}
                <div className="flex flex-col gap-4 w-1/2">
                  {responses &&
                    Object.keys(responses)
                      .filter((_, index) => index % 2 === 0) // Odd-indexed items
                      .map((key) => {
                        const questionData = responses[key];
                        return questionData.type === "MCQ" ? (
                          <MCQQuestion
                            questionId={key}
                            questionData={questionData}
                          />
                        ) : (
                          <FreeTextQuestion
                            questionId={key}
                            questionData={questionData}
                          />
                        );
                      })}
                </div>
                {/* Second Column */}
                <div className="flex flex-col gap-4 w-1/2">
                  {responses &&
                    Object.keys(responses)
                      .filter((_, index) => index % 2 !== 0) // Even-indexed items
                      .map((key) => {
                        const questionData = responses[key];
                        return questionData.type === "MCQ" ? (
                          <MCQQuestion
                            questionId={key}
                            questionData={questionData}
                          />
                        ) : (
                          <FreeTextQuestion
                            questionId={key}
                            questionData={questionData}
                          />
                        );
                      })}
                </div>
              </div>
              ) : (
                // Empty State UI
                <div className="flex flex-col items-center justify-center w-full py-10">
                  <h2 className="text-xl font-semibold text-gray-600">
                    No responses to show
                  </h2>
                  <p className="text-gray-500 text-center">
                    There are no responses for this question yet. Once users respond, they
                    will appear here.
                  </p>
                </div>
              )}
            </>
          )}

          {state.tab === "insights" && (
            <>
              <LineChart drop_off_amounts={dropOffAmounts} />
              {/* <ResultsCharts data={responses}/> */}
            </>
          )}
        </div>

        <button
          className="fixed bottom-0 flex justify-center gap-2 right-0 mb-12 mr-12 rounded-3xl bg-gradient-to-b from-purple-grad-dark-start to-purple-grad-dark-end px-6 py-4"
          onClick={() => {
            dispatchAction(toogleChanges({ name: "askPolly" }));
          }}
        >
          <div>
            <img src="/images/results/ai.svg" alt="img" />
          </div>
          <div className="text-white">Asky Polly</div>
        </button>

        {/* {openPolly == true && <Polly key={key} />} */}
      </div>
    </React.Fragment>
  );
};

export default Results;
