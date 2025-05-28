"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import Select, { MultiValue } from 'react-select';
import { useParams } from 'next/navigation'
import {
  addConversation,
  deleteConversation,
  editConversation,
  selectConversation,
  setCurrentPoll,
  fetchConversations,
  setConversations,
  UnifiedKnowledgePayload,
  UnifiedKnowledgeDocument
} from '@/lib/features/askPolly/askPollySlice';
import { toogleChanges } from '@/lib/features/workspace/analyzeHeaderSlice';
import {
  deleteConversationById,
  FileMetadata,
  getFiles,
  saveUnifiedKnowledge
} from '@/app/api/ask polly/polly';
import { FaEllipsisH, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Text from '@/components/ui/Texts/Text';

const ConversationHistory = () => {
  const {pollid} = useParams();
  const pollId = Array.isArray(pollid) ? pollid[0] : pollid;

  const dispatch = useAppDispatch();
  const { conversations, selectedConversation, isLoading, currentPollId } = useAppSelector(
    (state) => state.askPolly
  );

  // Local state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [lastFetchedPollId, setLastFetchedPollId] = useState<string | undefined>(undefined);
  
  // Files state
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [analysisFiles, setAnalysisFiles] = useState<MultiValue<FileMetadata>>([]);
  const [contextFiles, setContextFiles] = useState<MultiValue<FileMetadata>>([]);
  const [referenceFiles, setReferenceFiles] = useState<MultiValue<FileMetadata>>([]);
  const [instructions, setInstructions] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch conversations when pollId changes
  useEffect(() => {
    const fetchData = async () => {
      if (pollId && pollId !== lastFetchedPollId) {
        // Clear existing conversations
        dispatch(setConversations([]));
        
        // Update current poll ID and fetch new conversations
        dispatch(setCurrentPoll(pollId));
        await dispatch(fetchConversations(pollId));
        
        setLastFetchedPollId(pollId);
      }
    };

    fetchData();
  }, [dispatch, pollId, lastFetchedPollId]);

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      setIsFileLoading(true);
      try {
        const fetchedFiles = await getFiles(undefined, pollId);
        const formattedFiles = fetchedFiles.map(file => ({
          ...file,
          value: file.title,
          label: file.title,
        }));
        setFiles(formattedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setIsFileLoading(false);
      }
    };

    fetchFiles();
  }, [pollId]);

  // Handlers
  const handleAddConversation = useCallback(() => {
    const activePollId = pollId || currentPollId;
    if (!activePollId) {
      alert('Cannot create conversation: No poll selected');
      return;
    }

    const newConversationTitle = `New Chat ${conversations.length + 1}`;
    dispatch(addConversation({ 
      conversation_title: newConversationTitle,
      poll_id: activePollId
    }));

    // Scroll to top
    setTimeout(() => {
      const conversationList = document.getElementById('conversation-list');
      if (conversationList) {
        conversationList.scrollTop = 0;
      }
    }, 100);
  }, [dispatch, conversations.length, pollId, currentPollId]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      const response = await deleteConversationById(id);
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (parsedResponse?.status === 'success') {
        dispatch(deleteConversation(id));
        setMenuId(null);

        // Select another conversation if current one is deleted
        if (selectedConversation === id && conversations.length > 1) {
          const nextConversation = conversations.find(c => c.conversation_id !== id);
          if (nextConversation) {
            dispatch(selectConversation(nextConversation.conversation_id));
          }
        }
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      alert(error.response?.data?.detail || 'Failed to delete conversation. Please try again.');
    }
  }, [dispatch, conversations, selectedConversation]);



  const handleSave = async () => {
    if (!selectedConversation) {
        alert('Please select a conversation first');
        return;
    }
  
    setSaveLoading(true);
    try {
        const userId = localStorage.getItem("userId") || localStorage.getItem("email") || 'default_user';
        const documents: UnifiedKnowledgeDocument[] = [
            ...analysisFiles.map(file => ({
                file_id: file.id,
                file_name: file.file_name || file.id,
                category: 'analysis' as const,  // Type assertion here
                metadata: {
                    poll_id: currentPollId || pollId,
                    title: file.title || file.file_name
                }
            })),
            ...contextFiles.map(file => ({
                file_id: file.id,
                file_name: file.file_name || file.id,
                category: 'context' as const,  // Type assertion here
                metadata: {
                    poll_id: currentPollId || pollId,
                    title: file.title || file.file_name
                }
            })),
            ...referenceFiles.map(file => ({
                file_id: file.id,
                file_name: file.file_name || file.id,
                category: 'reference' as const,  // Type assertion here
                metadata: {
                    poll_id: currentPollId || pollId,
                    title: file.title || file.file_name
                }
            }))
        ].filter(doc => doc.file_id);

        const payload: UnifiedKnowledgePayload = {
            user_id: userId,
            poll_id: currentPollId || pollId,
            conversation_id: selectedConversation,
            documents,
            instructions: instructions ? {
                instructions,
                context_type: 'general',
                metadata: {
                    poll_id: currentPollId || pollId,
                    timestamp: new Date().toISOString()
                }
            } : undefined,
            batch_processing: false
        };
  
        const response = await saveUnifiedKnowledge(payload);
      
        if (response.overall_status === 'success') {
            alert('Knowledge base settings saved successfully!');
        } else {
            throw new Error(`Failed to save: ${response.overall_status}`);
        }
    } catch (error: any) {
        console.error('Error saving knowledge base:', error);
        console.error('Error details:', error.response?.data);
        alert(error.response?.data?.detail || 'Failed to save knowledge base settings. Please try again.');
    } finally {
        setSaveLoading(false);
    }
};
  // Title parsing utility
  const parseTitle = useCallback((title: any): string => {
    try {
      if (!title) return 'New Conversation';
      
      let processedTitle = title;
      if (typeof title === 'string' && (title.startsWith('"') || title.startsWith('{'))) {
        try {
          processedTitle = JSON.parse(title);
        } catch {
          processedTitle = title;
        }
      }
      
      return processedTitle
        .replace(/\*\*/g, '')
        .replace(/__/g, '')
        .replace(/\\/g, '')
        .trim();
    } catch (e) {
      return title?.toString() || 'New Conversation';
    }
  }, []);

  // Filter conversations for current poll
  const filteredConversations = conversations.filter(conv => 
    conv.poll_id === (pollId || currentPollId)
  );

  return (
    <div className="absolute overflow-y-auto inset-0 w-full flex flex-col h-full gap-5 p-4 bg-white shadow-md border-r border-gray-200 px-2 sm:px-4 lg:px-8 custom-scrollbar">
      {/* Conversations Section */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleAddConversation}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <img src="/images/askPolly/editBtn.svg" alt="Edit" />
            </button>
            <button onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
              {isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {isAccordionOpen && (
          <ul id="conversation-list" className="space-y-2">
            {filteredConversations.map((conversation) => (
              <li
                key={conversation.conversation_id}
                className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  selectedConversation === conversation.conversation_id
                    ? "bg-primaryBlue text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => dispatch(selectConversation(conversation.conversation_id))}
              >
                {editingId === conversation.conversation_id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => {
                      dispatch(editConversation({ 
                        id: conversation.conversation_id, 
                        conversation_title: newTitle || "Untitled" 
                      }));
                      setEditingId(null);
                    }}
                    className={`bg-transparent ${
                      selectedConversation === conversation.conversation_id
                        ? "text-primaryWhite"
                        : "text-primaryBlue"
                    } w-full focus:outline-none`}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium truncate">
                    {parseTitle(conversation.conversation_title)}
                  </span>
                )}

                <div className="relative">
                  <FaEllipsisH
                    className={`cursor-pointer ${
                      selectedConversation === conversation.conversation_id 
                        ? "text-primaryWhite" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuId(menuId === conversation.conversation_id ? null : conversation.conversation_id);
                    }}
                  />
                  {menuId === conversation.conversation_id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(conversation.conversation_id);
                          setNewTitle(conversation.conversation_title);
                          setMenuId(null);
                        }}
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.conversation_id);
                        }}
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Files Collection Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Knowledge</h3>
          <button
            onClick={() => {
              dispatch(toogleChanges({ name: "Files" }));
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <img src="/images/askPolly/uploadBtn.svg" alt="icon" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              <Text variant="body15R">
                1. Select primary files for
                <span className="font-semibold"> analysis</span>
              </Text>
            </label>
            <Select
              isMulti
              options={files.filter(
                (ele) => ele.category == "analysis" || ele.category == "Default" || ele.category == "Core Analysis"
              )}
              value={analysisFiles}
              onChange={setAnalysisFiles}
              placeholder={isFileLoading ? "Loading" : "Select primary files"}
              className="mt-1"
              isLoading={isFileLoading}
              isDisabled={isFileLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              <Text variant="body15R">
                2. Select files with
                <span className="font-semibold"> context</span>
              </Text>
            </label>
            <Select
              isMulti
              options={files.filter((ele) => ele.category == "context" || ele.category == "Context")}
              value={contextFiles}
              onChange={setContextFiles}
              placeholder={isFileLoading ? "Loading" : "Select primary files"}
              className="mt-1"
              isLoading={isFileLoading}
              isDisabled={isFileLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              <Text variant="body15R">
                3. Select any files as
                <span className="font-semibold"> reference</span>
              </Text>
            </label>
            <Select
              isMulti
              options={files.filter((ele) => ele.category == "reference" || ele.category == "Reference")}
              value={referenceFiles}
              onChange={setReferenceFiles}
              placeholder={isFileLoading ? "Loading" : "Select primary files"}
              className="mt-1"
              isLoading={isFileLoading}
              isDisabled={isFileLoading}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">
            <Text variant="body15R">
              4. Add any additional context / reasoning for the conversation
            </Text>
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions on how you want the AI to respond for this survey, what are you looking for, specific dos and don’ts, your step-by-step process (if needed), etc."
            className="w-full p-2 border border-gray-300 rounded-md h-28 text-sm placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-1 mb-2 w-full flex">
            {
              saveLoading
              ?(
                <div className="w-6 h-6 ml-auto">
                  <img src="/loaders/loader-blue.gif" alt="icon" />
                </div>
              )
              :(
              <button
                onClick={handleSave}
                className="text-blue-500 text-sm enabled:hover:underline ml-auto disabled:text-blue-400 disabled:cursor-not-allowed"
                disabled={analysisFiles.length === 0 && referenceFiles.length === 0 && contextFiles.length === 0}
              >
                Save
              </button>
              )
            }
          </div>
          <p className="text-xs mt-1">
            <span className="font-semibold">Note: </span>Think about how you
            would analyze the results and instruct the AI accordingly.
          </p>
        </div>
      </div>
      {/* <UnifiedKnowledgeHandler 
  selectedConversation={selectedConversation || ''}
  currentPollId={pollId || currentPollId || ''}
  files={files.map(file => ({
    ...file,
    category: file.category as "analysis" | "context" | "reference"
  }))}
  onSave={handleSave}
/> */}
    </div>
  );
};

export default ConversationHistory;
