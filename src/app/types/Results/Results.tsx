interface Answer {
  answer: string;
  count: number;
  percentage: number;
}

// export interface ResponseData {
//   [key: string]: {
//     answers: Answer[];
//     question: string;
//     type: string;
//     total_count: number;
//   };
// }

export interface ResponseData {
  [key: string]: {
    answers: {
      answer: string;
      count: number;
      percentage: number;
    }[];
    question: string;
    type: string;
    total_count: number;
    options: string[]; // Add this property for MCQ responses
  };
}

export interface StatCardProps {
  title: string;
  iconSrc: string;
  value: string | number;
  incrementValue?: string | number;
  unit?: string;
}
