export interface UploadDataType {
  workspace: string;
  title: string;
  goal: string;
  document: string;
  endafterdate: string;
  endafterresponses: string;
  geography: string[];
  education: string;
  industry: string;
  visibility: string;
}

export interface ProfileSetupFormData {
  email: string;
  salutation: string;
  firstName: string;
  lastName: string;
  location: string;
  industry: { name: string };
  phoneNumber: string;
}

export interface ZapPollDataType {
  title: string;
  iwantto: string;
  tellusmore: string;
}

interface PreviousQuestion {
  max_no_of_choices: number;
  question_number: number;
  total_time: string;
  question: string;
  completion: string;
  type: string;
  options: string[];
  answer: string;
  responder_id: string;
  answer_type: string;
}

export interface CurrentQuestionState {
  survey_code: string;
  current_question: PreviousQuestion;
}

export interface OutlineState {
  title: string;
  outline_id: string;
  education: string;
  endafterdate: string;
  geography: string;
  goal: string;
  industry: string;
  instruction: string;
  introduction: string;
  visibility: string;
  endafter: string;
  version: string;
  endafterresponses: string;
}
