export interface UploadData {
  id: number;
  numberofquestions: number;
  outline_id: string;
  questions: Question[];
  status: string;
  time: string;
  title: string;
}

export interface Question {
  branching: string;
  dynamic_followup: boolean;
  allow_others: boolean;
  example_questions: any; // Replace with appropriate type if needed
  importance: string;
  instruction: string;
  keywords_to_probe: any; // Replace with appropriate type if needed
  max_no_of_questions: any; // Replace with appropriate type if needed
  objective: any; // Replace with appropriate type if needed
  question: string;
  question_number: string;
  required: boolean;
  things_to_avoid: any; // Replace with appropriate type if needed
  type: string;
  max_no_of_choices: string;
}
