import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/app/api/ask polly/polly";

// Types
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

export interface UnifiedKnowledgeDocument {
  file_id: string;
  file_name: string;
  category: 'analysis' | 'context' | 'reference';  
  metadata?: {
    poll_id?: string;
    title?: string;
    [key: string]: any;
  };
}

export interface UnifiedKnowledgePayload {
  user_id: string;
  conversation_id: string;
  poll_id: string;
  documents: UnifiedKnowledgeDocument[];
  instructions?: {
    instructions: string;
    context_type: string;
    metadata?: {
      poll_id?: string;
      timestamp?: string;
      [key: string]: any;
    };
  };
  batch_processing: boolean;
}

export interface Conversation {
  conversation_id: string;
  conversation_title: string;
  messages: Message[];
  timestamp: string;
  poll_id?: string | null;
}

interface StoreConversationRequest {
  conversation_id: string;
  conversation_title: string;
  messages: Message[];
  poll_id: string;  // Required poll ID
}

interface PollSpecificResponse {
  status: string;
  conversations: Conversation[];
  poll_id?: string;
}

interface ReportItem {
  id: string;
  title: string;
  text: string;
  user_query: string;
}

// Add WebSocket-related types
interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
}

interface WSMessage {
  type: 'response' | 'status' | 'error';
  content: string;
  timestamp: string;
  metadata?: any;
  conversation_id?: string;
}

interface AskPollyState {
  conversations: Conversation[];
  selectedConversation: string | null;
  isLoading: boolean;
  error: string | null;
  reportItems: ReportItem[];
  currentPollId: string | null;
  wsStatus: WebSocketStatus;
  messageProcessing: boolean;
}

const initialState: AskPollyState = {
  conversations: [],
  selectedConversation: null,
  isLoading: false,
  error: null,
  reportItems: [],
  currentPollId: null,
  wsStatus: {
    connected: false,
    reconnecting: false,
    error: null
  },
  messageProcessing: false
};

interface AddConversationPayload {
  conversation_title: string;
}

// Default AI messages for new conversations
const defaultMessages: Message[] = [
  { 
    role: 'assistant',
    content: "Hello",
    timestamp: new Date().toISOString()
  },
  {
    role: 'assistant',
    content: "How can I assist you today?",
    timestamp: new Date().toISOString()
  }
];


export const fetchConversations = createAsyncThunk(
  'askPolly/fetchConversations',
  async (pollId: string | undefined, { rejectWithValue }) => {
    try {
      const endpoint = pollId 
        ? `/agent/get-conversations?poll_id=${pollId}`
        : '/agent/get-conversations';
      
      const response = await api.get<PollSpecificResponse>(endpoint);
      
      if (response.data.status === 'success') {
        const conversations = response.data.conversations;
        
        // Filter conversations based on pollId if it's provided
        const filteredConversations = pollId
          ? conversations.filter(conv => conv.poll_id === pollId)
          : conversations;

        return {
          conversations: filteredConversations.map(conversation => ({
            ...conversation,
            poll_id: pollId || conversation.poll_id
          })),
          pollId: pollId
        };
      }
      return rejectWithValue('Failed to fetch conversations');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch conversations');
    }
  }
);

export const createWebSocketMiddleware = (wsService: any) => (store: any) => (next: any) => (action: any) => {
  if (action.type === 'askPolly/addMessage' && action.payload.message.role === 'user') {
    const state = store.getState().askPolly;
    
    // Send message through WebSocket if we have a connection
    if (state.wsStatus.connected && action.payload.shouldStore !== false) {
      wsService.sendMessage({
        content: action.payload.message.content,
        conversation_id: action.payload.conversationId,
        poll_id: state.currentPollId,
        conversation_title: state.conversations.find(
          (conv: Conversation) => conv.conversation_id === action.payload.conversationId
        )?.conversation_title
      });
    }
  }
  
  return next(action);
};

const askPollySlice = createSlice({
  name: "askPolly",
  initialState,
  reducers: {
    setWebSocketStatus: (state, action: PayloadAction<Partial<WebSocketStatus>>) => {
      state.wsStatus = {
        ...state.wsStatus,
        ...action.payload
      };
    },

    setMessageProcessing: (state, action: PayloadAction<boolean>) => {
      state.messageProcessing = action.payload;
    },

    // Handle incoming WebSocket messages
    handleWebSocketMessage: (state, action: PayloadAction<WSMessage>) => {
      const { type, content, timestamp, metadata, conversation_id } = action.payload;

      switch (type) {
        case 'response':
          // Find the correct conversation using the conversation_id from the response
          const conversation = state.conversations.find(
            conv => conv.conversation_id === state.selectedConversation
          );
          
          if (conversation) {
            // Add the message to the existing conversation
            conversation.messages.push({
              role: 'assistant',
              content,
              timestamp,
              metadata
            });
            conversation.timestamp = new Date().toISOString();
          }
          state.messageProcessing = false;
          break;

        case 'status':
          state.messageProcessing = true;
          break;

        case 'error':
          state.error = content;
          state.messageProcessing = false;
          break;
      }
    },

    // Update addMessage to handle WebSocket messages
    addMessage: (
      state,
      action: PayloadAction<{ 
        conversationId: string; 
        message: Message;
        shouldStore?: boolean;
      }>
    ) => {
      const conversation = state.conversations.find(
        conversation => conversation.conversation_id === action.payload.conversationId
      );
      
      if (conversation) {
        // Ensure we're adding to the existing messages array
        conversation.messages = [...conversation.messages, action.payload.message];
        conversation.timestamp = new Date().toISOString();
      }
    },
    // Clear message processing state
    clearMessageProcessing: (state) => {
      state.messageProcessing = false;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      if (!state.selectedConversation && action.payload.length > 0) {
        state.selectedConversation = action.payload[0].conversation_id;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setCurrentPoll: (state, action: PayloadAction<string | null>) => {
      state.currentPollId = action.payload;
    },
    updateConversationPollId: (state, action: PayloadAction<{
      conversationId: string;
      pollId: string;
    }>) => {
      const conversation = state.conversations.find(
        (conv) => conv.conversation_id === action.payload.conversationId
      );
      if (conversation) {
        conversation.poll_id = action.payload.pollId;
      }
    },
    addConversation: (state, action: PayloadAction<{
      conversation_title: string;
      poll_id?: string | null;
    }>) => {
      const newConversation: Conversation = {
        conversation_id: Date.now().toString(),
        conversation_title: action.payload.conversation_title,
        messages: [...defaultMessages],
        timestamp: new Date().toISOString(),
        poll_id: action.payload.poll_id ?? state.currentPollId
      };
      state.conversations.unshift(newConversation);
      state.selectedConversation = newConversation.conversation_id;
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (conversation) => conversation.conversation_id !== action.payload
      );
      if (state.selectedConversation === action.payload) {
        state.selectedConversation = state.conversations[0]?.conversation_id || null;
      }
    },

    editConversation: (
      state,
      action: PayloadAction<{ id: string; conversation_title: string }>
    ) => {
      const conversation = state.conversations.find(
        (conversation) => conversation.conversation_id === action.payload.id
      );
      if (conversation) {
        conversation.conversation_title = action.payload.conversation_title;
      }
    },

    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation = action.payload;
    },

    // addMessage: (
    //   state,
    //   action: PayloadAction<{ conversationId: string; message: Message }>
    // ) => {
    //   const conversation = state.conversations.find(
    //     (conversation) => conversation.conversation_id === action.payload.conversationId
    //   );
    //   if (conversation) {
    //     conversation.messages.push(action.payload.message);
    //   }
    // },

    setReportItems: (state, action: PayloadAction<ReportItem[]>) => {
      state.reportItems = action.payload;
    },

    addReportItem: (
      state,
      action: PayloadAction<{ text: string; user_query: string }>
    ) => {
      const newReportItem: ReportItem = {
        id: Date.now().toString(),
        title: action.payload.text.slice(0, 25) + "...",
        text: action.payload.text,
        user_query: action.payload.user_query,
      };
      state.reportItems.unshift(newReportItem);
    },

    deleteReportItem: (state, action: PayloadAction<string>) => {
      state.reportItems = state.reportItems.filter(
        (item) => item.id !== action.payload
      );
    },

    editReportTitle: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const reportItem = state.reportItems.find(
        (item) => item.id === action.payload.id
      );
      if (reportItem) {
        reportItem.title = action.payload.title;
      }
    },

    searchReportItems: (state, action: PayloadAction<string>) => {
      // Implementation for search functionality if needed
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchConversations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchConversations.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update conversations, ensuring they're filtered by pollId if present
      state.conversations = action.payload.conversations.map((conversation) => ({
        ...conversation,
        conversation_title: conversation.conversation_title || "Untitled",
        poll_id: action.payload.pollId || conversation.poll_id
      }));
      
      if (action.payload.pollId) {
        state.currentPollId = action.payload.pollId;
        // Only keep conversations associated with this poll
        state.conversations = state.conversations.filter(
          conv => conv.poll_id === action.payload.pollId
        );
      }
      
      // Update selected conversation if needed
      if (!state.selectedConversation && state.conversations.length > 0) {
        state.selectedConversation = state.conversations[0].conversation_id;
      } else if (state.selectedConversation) {
        // Check if currently selected conversation is still valid
        const stillExists = state.conversations.some(
          conv => conv.conversation_id === state.selectedConversation
        );
        if (!stillExists && state.conversations.length > 0) {
          state.selectedConversation = state.conversations[0].conversation_id;
        }
      }
    })
    .addCase(fetchConversations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.conversations = []; // Clear conversations on error
    });
  },
});

export const {
  setConversations,
  setLoading,
  setError,
  addConversation,
  deleteConversation,
  editConversation,
  selectConversation,
  updateConversationPollId,
  addMessage,
  setReportItems,
  addReportItem,
  deleteReportItem,
  editReportTitle,
  searchReportItems,
  setWebSocketStatus,
  setMessageProcessing,
  handleWebSocketMessage,
  clearMessageProcessing,
  setCurrentPoll, // Add this
} = askPollySlice.actions;

export default askPollySlice.reducer;