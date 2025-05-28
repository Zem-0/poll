"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getNextQuestionVoice } from "@/app/api/conversation/conversation";
import { sendFeedback } from "@/app/api/conversation/conversation";
import { QuestionTypes } from "@/constants/enums/QuestionTypes/QuestionTypes";
import { prevConversation } from "@/lib/features/conversation/conversationSlice";
import { RootState } from "@/lib/store";

import { LiveConnectionState, LiveTranscriptionEvent, LiveTranscriptionEvents, useDeepgram } from "./context/DeepgramContextProvider";
import { MicrophoneEvents, MicrophoneState, useMicrophone } from "./context/MicrophoneContextProvider";
import { toogleConversationType } from "@/lib/features/conversation/conversationSlice";


interface SpeechComponentProps {
  question_type: string;
  conversation_id: string;
  unique_id: string;
}

const SpeechComponent: React.FC<SpeechComponentProps> = ({ question_type, conversation_id, unique_id }) => {
  const conversation = useSelector((state: RootState) => state.conversation);
    const [noMoreText, setNoMoreText] = useState<boolean>(false);

      const feedBacks = [
    { name: "loved", value: "Loved it" },
    { name: "liked", value: "Liked it" },
    { name: "disliked", value: "Boo..." },
  ];

  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioResponse, setAudioResponse] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    const getAudio = async () => {
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API;

      try {
        const textList = conversation.currentQuestion.current_question.options;

        let text = "";
        if (textList !== null) {
          for (let i = 0; i < textList.length; i++) {
            text += `... ${i + 1} ${textList[i]}`;
          }
        }

        const question = conversation.currentQuestion.current_question.question + text;
        const response = await axios.post(
          "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
          { text: question },
          {
            headers: {
              Authorization: `Token ${apiKey}`,
              "Content-Type": "application/json",
            },
            responseType: "blob",
          }
        );

        const blobUrl = URL.createObjectURL(response.data);
        setAudioSrc(blobUrl);

        audioRef.current?.load();
        if (audioRef.current) {
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error generating audio:", error);
      }
    };

    getAudio();
  }, [conversation.currentQuestion.current_question.options, conversation.currentQuestion.current_question.question]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
    }
  }, [audioSrc]);

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  async function NextQuestion() {
    try {
      const response = await getNextQuestionVoice(audioResponse, conversation.currentQuestion);
      dispatch(prevConversation({ current_question: response?.data }));

      if (response?.status===200){
        if (response?.data.message === "No more questions available") {
           setNoMoreText(true);
           // window.location.href = "/thanks";
         }
      }
      setAudioResponse("");
    } catch (err) {
      console.log(err);
    }
  }

  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      connection?.send(e.data);
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      //   console.log("thisCaption", thisCaption);
      if (thisCaption !== "") {
        console.log('thisCaption !== ""', thisCaption);
      }

      if (isFinal && speechFinal) {
        console.log("is paused", isPaused);

        console.log("The data will be stored", thisCaption);
        setAudioResponse((prevAudioResponse) => prevAudioResponse + thisCaption);
        console.log("Cuirrent audio response is ", audioResponse);

        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  const [feedBack, setFeedback] = useState("");
    async function handleFeedback(feedback: string) {
    setFeedback(feedback);

    try {
      const response = await sendFeedback(conversation_id, unique_id, feedback);
      if (response?.status == 200) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="absolute z-50 shadow-xl bg-gradient-to-b from-[#0D0F13] to-[#313848] w-full flex flex-col h-full overflow-hidden lg:h-2/3 lg:w-1/3 xl:w-1/4 2xl:w-1/5 xl:h-2/3 2xl:h-3/4 p-6 rounded-xl translate-y-[-2rem]">
        <div className=" flex flex-row">
          <div className="w-2/3">
            <div className="flex items-center ">
              <div className="flex-shrink-0 w-2/4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-Mustard"
                  style={{
                    width: `${conversation.currentQuestion?.current_question?.completion || 0}`,
                  }}
                />
              </div>
              <div className="ml-2">
                <span className="text-white text-exsm font-semibold">
                  {0}% | {12} min 
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto flex justify-end gap-2">
            <button className="bg-[#393643] rounded-lg p-1" onClick={() => {
                      setIsPaused(true);
                      dispatch(toogleConversationType({ userPreference: "text" }));
                    }}>
              <img className="pointer-events-none" src="/images/conversation/go.svg" alt="" />
            </button>
          </div>
        </div>
        <div className="h-3/4 flex flex-row items-center justify-center">
          {question_type === QuestionTypes.FREE_TEXT && <div className="text-msm font-medium text-white">{conversation.currentQuestion.current_question.question}</div>}

          {question_type === QuestionTypes.MCQ && (
            <div className="text-[22px] text-white px-10">
              <div className="text-msm font-medium">{conversation.currentQuestion.current_question.question}</div>
              <div className="flex flex-col">
                {conversation.currentQuestion.current_question.options !== null &&
                  conversation.currentQuestion.current_question.options?.map((option, index) => (
                    <>
                      <div className="text-msm font-medium flex gap-1" key={index}>
                        <div>{index + 1}</div>
                        <div>{option}</div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-grow flex flex-col items-center gap-12 justify-around text-white ">
          {/* <div>{blob && <AudioVisualizer ref={visualizerRef} blob={blob} width={500} height={75} barWidth={1} gap={0} barColor="#f76565" />}</div> */}
   {noMoreText === true && (
                          <div className="flex w-5/6 flex-col py-6  items-center">
                            <div className="text-center p-4 font-semibold w-full text-white">How was your poll experience?</div>
                            <div className="flex w-full flex-row justify-between gap-2">
                              {feedBacks.map((item, index) => (
                                <>
                                  <button
                                    className={`${
                                      item.name === feedBack ? "bg-gradient-to-b from-Purple-Grad-Dark-900 to-Purple-Grad-Dark-500 text-white" : ""
                                    } border  border-blue-800 flex flex-col items-center justify-center rounded-md  hover:bg-yellow-400 hover:outline-none hover:border-none px-3 py-1.5`}
                                    onClick={() => {
                                      handleFeedback(item.name);
                                    }}
                                    key={index}
                                  >
                                    <div className="text-medium font-normal text-white">{item.value}</div>
                                    <div>
                                      <img src={`/images/conversation/${item.name}.svg`} />
                                    </div>
                                  </button>
                                </>
                              ))}
                            </div>
                          </div>
                        ) }
        </div>
        



        <button onClick={togglePause} className=" flex py-4 justify-center items-end  text-[#FFEFCB]">
          {"<<"}Replay
        </button>

        <div>
          {audioSrc && (
            <>
              <div>
                <audio ref={audioRef} src={audioSrc} />
                <div className="flex  w-full justify-center">
                  {isPaused == false ? (
                    <>
                      <button
                        onClick={() => {
                          console.log("The audio is paused");
                          setIsPaused(true);
                        }}
                        id="start"
                      >
                        <img src="/images/conversation/sound.svg" alt="" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className=" justify-center gap-6 w-full flex items-center">
                        <div>
                          <button>
                            <img src="/images/conversation/redo.svg" alt="" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setIsPaused(false);
                          }}
                        >
                          <img src="/images/conversation/pause.svg" alt="" />
                        </button>

                        <div className="text-[#E97451]">
                          <button
                            onClick={() => {
                              NextQuestion();
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SpeechComponent;
