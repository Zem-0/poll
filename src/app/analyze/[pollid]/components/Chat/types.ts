export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatEvent {
  type: string;
  data: {
    content: string;
    [key: string]: any;
  };
}

export interface ChatRequest {
  messages: ChatMessage[];
  thread_id: string;
  auto_accepted_plan: boolean;
  max_plan_iterations: number;
  max_step_num: number;
  max_search_results: number;
  enable_background_investigation: boolean;
} 