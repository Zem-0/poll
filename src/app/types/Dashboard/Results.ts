export type CompletionData = {
  ai_time_to_complete: string;
  average_time_to_complete: string;
  completion_rate: string;
  increment_completion_rate: string;
  increment_people_reached: string;
  increment_starts: string;
  people_reached: number;
  starts: number;
  status: string;
};

export interface Poll {
  name: string;
  title: string;
  goal: string;
  visibility: string;
  endafterresponses: string;
  endafterdate: string;
  lengthtime: string;
  lengthquestions: string;
  completion: string;
  outline_id: string;
  status: string;
}
