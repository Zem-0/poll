import { setConversations, setError, setLoading, UnifiedKnowledgePayload } from "@/lib/features/askPolly/askPollySlice";
import { user } from "@/static/workspace";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_PORT,
  headers: {
    'APISECRET': process.env.NEXT_PUBLIC_APISECRET,
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['JWTToken'] = token;
  }
  return config;
});

// Cache implementation with TypeScript
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>>;
  private readonly CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

const cache = Cache.getInstance();


interface Bookmark {
  _id: string;
  user_id: number;
  title: string;
  user_query: string;
  base_response: string;
  created_at: string;
}

interface BookmarkResponse {
  status: string;
  data: Bookmark[];
}

interface ReportItem {
  id: string;
  title: string;
  text: string;
  user_query: string;
}

// Update or add the bookmark-related functions
interface BookmarkCreate {
  title: string;
  user_query: string;
  base_response: string;
  metadata?: {
    poll_id?: string;
    [key: string]: any;
  };
}




async function getBookmarks(pollId?: string): Promise<BookmarkResponse> {
  try {
    const endpoint = pollId 
      ? `/bookmarks?poll_id=${pollId}`
      : '/bookmarks';
    
    const response = await api.get<BookmarkResponse>(endpoint);
    return response.data;
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    throw err;
  }
}

const editBookmark = async (id: string, title: string, user_query: string) => {
  try {
    const response = await api.put(`/bookmarks/${id}`, {
      title,
      user_query,
      poll_id: id // Include poll_id if needed by your backend
    });
    return response.data;
  } catch (error) {
    console.error("Error editing bookmark:", error);
    throw error;
  }
};

async function deleteBookmark(bookmarkId: string) {
  try {
    const response = await api.delete(`/bookmarks/${bookmarkId}`);
    cache.invalidate('bookmarks');
    return response.data;
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    throw err;
  }
}


// For Pinecone
interface FileMetadataPinecone {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  category: string;
  pages: number;
  uploaded_at: string;
}

// For Blob Storage
interface FileMetadata {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  category: string;
  pages: number;
  uploaded_at: string;
  content_type: string;
  selected: boolean;
}

// File upload response interface
interface FileUploadResponse {
  status: string;
  file_id: string;
  file_url: string;
  message: string;
}

async function uploadFile(
  file: File, 
  title: string, 
  category: string,
  pollId: string
): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('poll_id', pollId);

    const response = await api.post<FileUploadResponse>('/uploadFilestoBLob', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}


// In your API file (e.g., polly.ts)
async function updateFileMetadata(
  fileId: string,
  title: string,
  category: string,
  pollId: string
): Promise<{ status: string; message: string }> {
  try {
    const formData = new FormData();
    formData.append('file_id', fileId);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('poll_id', pollId);

    const response = await api.put('/updateFileMetadata', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error updating file metadata:", err);
    throw err;
  }
}

// Get files with optional filter and poll ID
async function getFiles(
  selected?: boolean,
  pollId?: string
): Promise<FileMetadata[]> {
  try {
    const params: Record<string, any> = {};
    if (selected !== undefined) params.selected = selected;
    if (pollId !== undefined) params.poll_id = pollId;

    const response = await api.get<FileMetadata[]>('/getfilteredFiles', { params });
    return response.data;
  } catch (err) {
    console.error("Error fetching files:", err);
    throw err;
  }
}

// Toggle file selection
async function toggleFileSelection(fileId: string): Promise<{ status: string; message: string }> {
  try {
    const response = await api.put(`/applyfiltertoFiles/${fileId}/select`);
    return response.data;
  } catch (err) {
    console.error("Error toggling file selection:", err);
    throw err;
  }
}

// Delete file
async function deleteFile(fileId: string): Promise<{ status: string; message: string }> {
  try {
    const response = await api.delete(`/deleteblobFile/${fileId}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err;
  }
}

const uploadToPinecone = async (
  file: File | Blob,
  title: string,
  category: string,
  pollId: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("poll_id", pollId);

    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("JWT Token not found");
    }

    const response = await api.post("/uploadFilestoBLob", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        JWTToken: token, // Include the JWT token header
      },
    });

    if (response.status === 200) {
      return JSON.stringify(response.data); // Return a stringified response
    } else {
      throw new Error(response.data.detail || "File upload failed");
    }
  } catch (error: any) {
    console.error("Error uploading file to Pinecone:", error.message || error);
    throw error;
  }
};

// Types for the API requests and responses
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ConversationHistory {
  role: string;
  content: string;
}


interface SearchResults {
  score: number;
  id: string;
  metadata: {
    text: string;
  };
}


// Function to generate response from AI
interface GenerateResponseRequest {
  text: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface GenerateResponseResponse {
  status: string;
  response: string;
  context: string;
}

interface EnsembleResponse {
  status: string;
  response: string;
}

interface FollowUpResponse {
  status: string;
  followup_questions: string[];
}

async function generateResponse(message: string, conversationHistory: Message[] = []) {
  try {
    // Convert messages to the expected format
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const requestData: GenerateResponseRequest = {
      text: message,
      conversation_history: history
    };

    const response = await api.post<GenerateResponseResponse>(
      '/agent/generate-response',
      requestData
    );

    return response.data;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

async function regenerateResponse(message: string, conversationHistory: Message[] = []) {
  try {
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await api.post<EnsembleResponse>(
      '/agent/generate-ensemble-response',
      {
        text: message,
        conversation_history: history
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error regenerating response:", error);
    throw error;
  }
}

async function generateFollowup(message: string, conversationHistory: Message[] = []) {
  try {
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await api.post<FollowUpResponse>(
      '/agent/generate-followup',
      {
        text: message,
        conversation_history: history
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating followup questions:", error);
    throw error;
  }
}

// Function to create a bookmark
// async function createBookmark(data: BookmarkRequest) {
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BACKEND_PORT}/agent/store-conversation`,
//       {
//         conversation_id: new Date().getTime().toString(), // Generate temporary ID
//         messages: [
//           {
//             role: "user",
//             content: data.user_query
//           },
//           {
//             role: "assistant",
//             content: data.base_response
//           }
//         ]
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           APISECRET: process.env.NEXT_PUBLIC_APISECRET
//         }
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error creating bookmark:", error);
//     throw error;
//   }
// }

// Function to search documents
async function searchDocuments(query: string, topK: number = 5, namespace?: string) {
  try {
    const response = await axios.post<{ status: string; results: SearchResults[] }>(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/agent/search`,
      {
        query,
        top_k: topK,
        namespace
      },
      {
        headers: {
          "Content-Type": "application/json",
          APISECRET: process.env.NEXT_PUBLIC_APISECRET
        }
      }
    );

    return response.data.results;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
}

// Function to check user satisfaction
async function checkSatisfaction(userFeedback: string, aiResponse: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/agent/check-satisfaction`,
      {
        user_feedback: userFeedback,
        ai_response: aiResponse
      },
      {
        headers: {
          "Content-Type": "application/json",
          APISECRET: process.env.NEXT_PUBLIC_APISECRET
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking satisfaction:", error);
    throw error;
  }
}

// Add these new interfaces
interface FollowUpResponse {
  status: string;
  followup_questions: string[];
}

interface EnsembleResponse {
  status: string;
  response: string;
}

interface InsightResponse {
  status: string;
  insights: string;
}

// Add regenerate/redo response functionality using ensemble agent
// async function regenerateResponse(message: string, conversationHistory: Message[] = []) {
//   try {
//     const history = conversationHistory.map(msg => ({
//       role: msg.isUser ? "user" : "assistant",
//       content: msg.text
//     }));

//     const response = await api.post<EnsembleResponse>(
//       '/agent/generate-ensemble-response',
//       {
//         text: message,
//         conversation_history: history
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error regenerating response:", error);
//     throw error;
//   }
// }

// Add follow-up questions generation
// async function generateFollowup(message: string, conversationHistory: Message[] = []) {
//   try {
//     const history = conversationHistory.map(msg => ({
//       role: msg.isUser ? "user" : "assistant",
//       content: msg.text
//     }));

//     const response = await api.post<FollowUpResponse>(
//       '/agent/generate-followup',
//       {
//         text: message,
//         conversation_history: history
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error generating followup questions:", error);
//     throw error;
//   }
// }

// Add insights generation
async function generateInsights(query: string, context: string, baseResponse: string, relevantChunks: any[] = [], userFeedback: string = "") {
  try {
    const response = await api.post<InsightResponse>(
      '/agent/generate-insights',
      {
        query,
        context,
        base_response: baseResponse,
        relevant_chunks: relevantChunks,
        user_feedback: userFeedback
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
}

const generateTitle = async (message: string): Promise<string> => {
  try {
    const response = await api.post<{ status: string; title: string }>(
      '/agent/generate-title',
      { message }
    );

    if (response.data.status === 'success' && response.data.title) {
      return response.data.title;
    }else{
      return "New Conversation";
    }
  } catch (error) {
    console.error("Title generation failed:", error);
    return "New Conversation";
  }
};

// In your API file (e.g., app/api/ask polly/polly.ts)


interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  insights?: {
    insights: string;
    metrics?: {
      [key: string]: number;
    }
  };
  metadata?: any;
}


export const updateConversation = async (
  conversationId: string,
  messages: Message[]
): Promise<void> => {
  await api.post(`/agent/update-conversation`, {
    conversation_id: conversationId,
    messages
  });
};

export interface StoreConversationRequest {
  conversation_id: string;
  conversation_title: string;
  messages: Message[];
  poll_id: string;  // Required poll ID
}


// Update the store conversation function to use the new interface
 async function storeConversation(request: StoreConversationRequest) {
    try {
      if (!request.poll_id) {
        throw new Error('Poll ID is required');
      }
  
      // Ensure all messages have required fields
      const validMessages = request.messages.filter(msg => 
        msg.role && 
        msg.content && 
        msg.timestamp
      );
  
  
      const payload = {
        conversation_id: request.conversation_id,
        conversation_title: request.conversation_title,
        messages: validMessages,
        poll_id: request.poll_id
      };
  
      const response = await api.post('/agent/store-conversation', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.data || response.data.status !== 'success') {
        throw new Error(`Failed to store conversation: ${JSON.stringify(response.data)}`);
      }
  
      return response.data;
    } catch (error) {
      console.error("Error storing conversation:", {
        error,
        request: {
          ...request,
          messages: request.messages.map(m => ({
            role: m.role,
            contentPreview: m.content.substring(0, 50)
          }))
        }
      });
      throw error;
    }
  }

// In your frontend API file (e.g., app/api/ask polly/polly.ts)
interface BookmarkRequest {
  title: string;
  user_query: string;
  base_response: string;
  poll_id: string;
}

const createBookmark = async (data: BookmarkRequest) => {
  return api.post('/bookmarks', {
    title: data.title,
    feedback_text: data.user_query,
    feedback_additional: data.base_response,
    user_query: data.user_query,
    base_response: data.base_response,
    poll_id: data.poll_id,
    responder_id: "0"
  }, {
    headers: {
      'APISECRET': process.env.NEXT_PUBLIC_APISECRET,
      'JWTToken': localStorage.getItem('access_token')
    }
  });
};

interface ConversationsResponse {
  status: string;
  conversations: Array<{
    conversation_title : string,
    conversation_id: string;
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
    timestamp: string;
  }>;
}

const fetchConversations = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    // Use the configured api instance instead of axios directly
    const response = await api.get<ConversationsResponse>('/agent/get-conversations');
    
    if (response.data.status === 'success') {
      dispatch(setConversations(response.data.conversations));
    } else {
      throw new Error('Failed to fetch conversations: Invalid response status');
    }
  } catch (error) {
    let errorMessage = 'Failed to fetch conversations';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    dispatch(setError(errorMessage));
    console.error('Error fetching conversations:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add these helper functions for better conversation management
const getConversationById = async (conversationId: string) => {
  try {
    const response = await api.get<ConversationsResponse>(`/agent/get-conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation ${conversationId}:`, error);
    throw error;
  }
};

const deleteConversationById = async (conversationId: string): Promise<string> => {
  try {
    const token = localStorage.getItem("access_token");
    const apiSecret = "pollvaultsecret"; // Make sure this is set in your .env file
    
    if (!token) {
      throw new Error("JWT Token not found");
    }

    const response = await api.delete(`/conversations/${conversationId}`, {
      headers: {
        JWTToken: token,
        APISECRET: apiSecret // Add the API secret header
      },
    });

    if (response.status === 200) {
      return JSON.stringify(response.data); // Ensure we return a string
    } else {
      throw new Error("Failed to delete conversation");
    }
  } catch (error: any) {
    console.error(`Error deleting conversation ${conversationId}:`, error);
    throw error;
  }
};

const updateConversationTitle = async (conversationId: string, title: string) => {
  try {
    const response = await api.put(`/agent/update-conversation/${conversationId}`, { title });
    return response.data;
  } catch (error) {
    console.error(`Error updating conversation ${conversationId}:`, error);
    throw error;
  }
};


// Define the request and response types for the new API
interface UnifiedKnowledgeSaveData {
  conversation_id: string;
  documents: Array<{
    file_id: string;
    file_name: string;
    category: string;
    metadata: Record<string, any>;
  }>;
  instructions: {
    instructions: string;
    context_type: string;
    metadata: Record<string, any>;
  };
  batch_processing: boolean;
}

interface UnifiedKnowledgeResponse {
  conversation_id: string;
  processing_results: Array<{
    document_id: string;
    category: 'analysis' | 'context' | 'reference';
    status: string;
    namespace: string;
    error_message?: string;
    metadata?: Record<string, any>;
  }>;
  category_namespaces: Record<string, string>;
  instructions_processed: boolean;
  timestamp: string;
  overall_status: string;
}

const saveUnifiedKnowledge = async (
  data: UnifiedKnowledgePayload
): Promise<UnifiedKnowledgeResponse> => {
  try {
    const response = await api.post<UnifiedKnowledgeResponse>('/unified-knowledge', data);
    return response.data;
  } catch (error) {
    console.error('Error saving unified knowledge:', error);
    throw error;
  }
};


interface NewQuestionParams {
  questionType: string;
  questionText: string;
  options: string[];
  pollId: string;
  importance?: 'low' | 'normal' | 'high';  // you can narrow down the type
  required?: boolean;                     // prefer booleans
  maxNoOfChoices?: number | null;
  instruction?: string;
  dynamicFollowup?: boolean;             // prefer booleans
  objective?: string;
  maxNoOfQuestions?: number | null;
  keywordsToProbe?: string;
  thingsToAvoid?: string;
  exampleQuestions?: string;
}

const addQuestionToPoll = async (
  pollId: string,
  questionText: string,
  questionType: string,
  options: string[],
  ratingType?: string,
  ratingScale?: object,
  ratingLabels?: object
) => {
  try {
    const requestData: any = {
      outline_id: pollId,
      question_text: questionText,
      question_type: questionType,
      importance: "normal",
      required: "TRUE",
      dynamic_followup: "FALSE",
      allow_others: false,
      max_no_of_choices: questionType === "Rating" ? 1 : null,
    };

    if (questionType === "MCQ") {
      requestData.options = options.filter((opt) => opt.trim());
    } else if (questionType === "RATING") {
      requestData.rating_type = ratingType;
      requestData.rating_scale = ratingScale;
      requestData.rating_labels = ratingLabels;
    }

    const access_token = localStorage.getItem("access_token") || "";

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/addtopollquestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        APISECRET: process.env.NEXT_PUBLIC_APISECRET || "",
        JWTToken: access_token,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        Array.isArray(data.detail)
          ? data.detail.map((err: any) => err.msg).join(", ")
          : data.detail || "Failed to add question"
      );
    }

    // Fetch the updated outline after adding a question
    const outlineResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_PORT}/getoutline`,
      { idoutline: pollId },
      {
        headers: {
          APISECRET: process.env.NEXT_PUBLIC_APISECRET || "",
          JWTToken: access_token,
        },
      }
    );

    return { success: true, outline: outlineResponse.data.outline };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};


// Update exports to include new functions
export {
  createBookmark,
  getBookmarks,
  deleteBookmark,
  uploadFile,
  updateFileMetadata,
  getFiles,
  toggleFileSelection,
  deleteFile,
  generateResponse,
  regenerateResponse,  
  generateFollowup,    
  generateInsights,    
  addQuestionToPoll,
  storeConversation,
  editBookmark,
  generateTitle,   
  searchDocuments,
  checkSatisfaction,
  uploadToPinecone,
  fetchConversations,
  getConversationById,
  deleteConversationById,
  updateConversationTitle,
  saveUnifiedKnowledge,

  // Types
  type BookmarkCreate,
  type Bookmark,
  type FileMetadata,
  type FileMetadataPinecone,
  type FileUploadResponse,
  type Message,
  type ReportItem,
  type SearchResults,
  type BookmarkResponse,
  type ConversationsResponse,
  type UnifiedKnowledgeSaveData,
  type FollowUpResponse,    
  type EnsembleResponse,    
  type InsightResponse,     
};



// @app.post("/knowledge-upload-file")
// async def upload_file(
//     file: UploadFile = File(...),
//     category: str = None,
//     conversation_id: Optional[str] = None
// ):
//     try:
//         if not file.content_type == "application/pdf":
//             raise HTTPException(
//                 status_code=400,
//                 content={"message": "Only PDF files are supported"}
//             )

//         # Generate conversation_id if not provided
//         conv_id = conversation_id or str(uuid.uuid4())
//         namespace