/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "@/app/polls/[pollid]/Sidebar";
import { QuestionTypes } from "@/constants/enums/QuestionTypes/QuestionTypes";
import { closeSurveyPublished } from "@/lib/features/workspace/outlineSlice";
import {
  handleChangeTitle,
  handleQuestionOptions,
  handleQuestionChange,
  handleReorderQuestions,
} from "@/lib/features/workspace/workspaceSlice";
import { RootState } from "@/lib/store";
import Text from "@/components/ui/Texts/Text";
import Button from "@/components/ui/buttons/Button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import QuestionItem from "./QuestionItem/QuestionItem";
import QuestionsLoading from "@/app/component/loading/QuestionsLoading";
import RatingComponent from "./RatingComponent/RatingComponent";
import QuestionPopup from "./QuestionItem/QuestionPopup";

interface PageProps {
  pollId: string;
  isQuestionsLoading: boolean;
}
const Outline: React.FC<PageProps> = ({ pollId, isQuestionsLoading }) => {
  const workspace = useSelector((state: RootState) => state.workspace.formData);
  const outlineSlice = useSelector((state: RootState) => state.outline);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragStart, setDragStart] = useState(false);
  const [survey, setSurvey] = useState("link");
  const [isEditable, setIsEditable] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [question, setQuestion] = useState({
    question_id: "",
    question_type: "",
    show: false,
  });
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
      (state: RootState) => state.currentWorkspace.currentWorkspace
    );

  const handleButtonClick = () => {
    setIsEditable((prevState) => !prevState);
  };

  function countNewlines(fteeText: string | null | undefined): number {
    if (fteeText == null) {
      return 0;
    }
    const text = fteeText.toString(); // Convert to string in case it's not
    const count = (text.match(/\n/g) || []).length;
    return count;
  }

  const sortedQuestions = useMemo(() => {
    return [...workspace.outline.questions].sort((a, b) => {
      const aNum = parseInt(a.question_number);
      const bNum = parseInt(b.question_number);
      return aNum - bNum;
    });
  }, [workspace.outline.questions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragStart(false);
    if (over && active.id !== over.id) {
      const oldIndex = workspace.outline.questions.findIndex(
        (item) => item.question_number === active.id
      );
      const newIndex = workspace.outline.questions.findIndex(
        (item) => item.question_number === over.id
      );
      const reorderedQuestions = arrayMove(
        workspace.outline.questions,
        oldIndex,
        newIndex
      );
      // Dispatch the new reordered list to Redux and update question numbers
      dispatch(handleReorderQuestions({ questions: reorderedQuestions })); // Dispatch to update questions
    }
  };

  // Filtered questions based on search query
  const filteredQuestions = useMemo(() => {
    return [...workspace?.outline?.questions].filter((question) =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, workspace.outline.questions]);

  return (
    <>
      <div className="w-full flex flex-row  h-full bg-Neutral ">
        <div
          className={`flex flex-col gap-8 p-12 ${outlineSlice.workspackeBlur == true ? "blur-sm w-full pointer-events-none" : "flex-1"} `}
        >
          <div className=" flex flex-row items-center gap-4">
            <Link href={`/dashboard/${encodeURIComponent(currentWorkspace || "My workspace")}`} className=" text-Pri-Dark">
              {/* <img src="/images/polls/back.png" alt="" /> */}
              <Text variant="body15SB" extraCSS="text-textGray">
                ← Back
              </Text>
            </Link>
            {/* for edit button */}
            {/* <div>
              {isEditable ? (
                <>
                  <input
                    className=" mr-4 font-normal font-sans bg-Neutral outline-none border-0 text-xl placeholder:text-black text-black"
                    placeholder={workspace?.outline.title}
                    value={workspace?.outline.title}
                    onChange={(e) => {
                      dispatch(handleChangeTitle({ title: e.target.value }));
                    }}
                  />
                  <button onClick={handleButtonClick}>
                    <Image
                      src="/images/polls/edit_input.svg"
                      alt=""
                      className="w-auto"
                      width={12}
                      height={12}
                    />
                  </button>
                </>
              ) : (
                <div className="flex flex-row">
                  <div className="text-xl font-normal mr-4 font-sans  text-black">
                    {workspace?.outline.title}
                  </div>
                  <button onClick={handleButtonClick}>
                    <Image
                      src="/images/polls/edit_input.svg"
                      alt=""
                      className="w-auto"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
              )}
            </div> */}
          </div>
          <div>
            <div className="sm:flex-auto flex flex-row ">
              <img
                src="/images/search.svg"
                alt=""
                className="bg-white rounded-l-md p-2"
              />
              <input
                type="search"
                placeholder="Search by question"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none border-none w-1/5 rounded-r-md text-black placeholder-Lt-Gray"
              />

              <div className="grow flex justify-end items-center gap-2">
                {/* <img src="/images/workspace/clock.svg" alt="" />
                <div className="text-exsm font-semibold">
                  {workspace?.outline.time || "0 mins"}
                </div> */}

                {/* for adding questions */}
                <div className="ml-2">
                  <Button
                    label="Add"
                    type="primaryBlack"
                    iconSrc="/images/plus.svg"
                    iconHoverSrc="/images/plusBlack.svg"
                    iconPosition="left"
                    onClick={() => setIsPopupOpen(true)}
                  />
                </div>
                {/* pop up for adding question*/}
                <QuestionPopup
                  isOpen={isPopupOpen}
                  onClose={() => setIsPopupOpen(false)}
                  pollId={pollId}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-lg">
            {isQuestionsLoading ? (
              // Skeleton Loading
              <QuestionsLoading />
            ) : // workspace.outline.numberofquestions != 0 && (
              filteredQuestions.length > 0 ? (
                <DndContext
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  onDragStart={() => setDragStart(true)}
                >
                  <SortableContext
                    items={workspace.outline.questions.map((item) =>
                      String(item.question_number)
                    )}
                  >
                    {/* {workspace.outline.questions.map((item) => ( */}
                    {filteredQuestions.map((item) => (
                      item?.type === "RATING" ? (
                        <RatingComponent 
                          key={item.question_number}
                          item={item}
                          setQuestion={setQuestion}
                          question={question}
                          dragStart={dragStart}
                        />
                      ) : (   
                        <QuestionItem
                          key={item.question_number}
                          item={item}
                          setQuestion={setQuestion}
                          question={question}
                          dragStart={dragStart}
                        />
                      )
                    ))}
                  </SortableContext>
                </DndContext>
              ): filteredQuestions.length === 0 ? (
                <Text variant="body15SB" extraCSS="text-textGray">
                  No questions found.
                </Text>
              ) : (
                <Text variant="body15SB" extraCSS="text-textGray">
                  Loading questions...
                </Text>
              )}
            {/* rating component will be integrated after the rating value starts comming from backend */}
            {/* <RatingComponent /> */}
          </div>
          <div className="bg-white  border-2 border-Golden h-24 rounded-xl p-6 w-full flex flex-row">
            <div className="w-8 flex justify-center items-center">
              <img src="/images/workspace/dots.svg" alt="" />
            </div>
            <div className="w-9/12">
              <div className="text-Purple-Grad-Dark-900 font-semibold">
                Suggested
              </div>
              <div className="text-Pri-Dark">
                Have you considered this question?{" "}
              </div>
            </div>
            <div className="flex flex-row items-center">
              <button className=" text-Pri-Dark bg-Neutral w-32 h-full  m-2 rounded-lg">
                No, thanks
              </button>
              <button className="bg-Pri-Dark h-full rounded-lg text-white w-32 m-2">
                Add to poll
              </button>
            </div>
          </div>
        </div>
        {/* {question.question_id != "" && <Sidebar question_id={question.question_id} question_type={question.question_type} />} */}
        <Sidebar
          question_id={question.question_id}
          question_type={question.question_type}
          pollId={pollId}
          show={question.show}
          key={pollId}
          setQuestion={setQuestion}
        />
      </div>
    </>
  );
};

export default Outline;
