export interface AnalysisPollDataType{
    title: string;
    purpose: string;
    insights: string;
    industry: string;
    platform: string;
    imported: boolean;
    customInstructions: string;
    workspace: string;
  };

  export interface AnalysisPoll {
    poll_id: string;
    title: string;
    purpose: string;
    insights: string;
    industry: string;
    platform: string;
    custom_instructions: string;
    imported: boolean;
    file_count: number;
    conversation_count: number;
    bookmark_count: number;
    status: string;
    workspace: string;
    created_at: string;
    updated_at: string;
  }
  