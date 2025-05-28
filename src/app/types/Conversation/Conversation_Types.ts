export interface Question {
  question_number: number;
  question: string;
  completion: string;
  total_time: string;
  type: string;
  options: string[];
  max_no_of_choices?: number;
  answer: string;
  attachment?: any;
  ratingValue?: number;
  rating_type?: string; 
  rating_labels?: Record<number, string>; 
  rating_scale?: { 
    min: number; 
    max: number; 
    step: number; 
    default: number; 
  };
}

interface WorkspaceLists {
  polls_count: string;
  workspace: string;
}

export interface Workspaces {
  workspaces: WorkspaceLists[];
}
