export interface VisibilityState {
  [key: string]: boolean;
}

export interface AudienceProps {
  basicFormData: {
    title: string;
    goal: string;
    document: string;
    endafterdate: string;
    endafterresponses: number;
  };
}

export interface ObjectType {
  [key: string]: boolean;
}
