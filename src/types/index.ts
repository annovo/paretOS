export type color =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;

export type buttonType = "button" | "reset" | "submit" | undefined;

export type buttonVariant = "text" | "contained" | "outlined" | undefined;

export type PlanningField = {
  name: string;
  code: string;
  content: string;
};

export interface User {
  rank?: number;
  score: number;
  id: number;
  fName: string;
  lName: string;
  email: string;
  github: string;
  missions: Array<Object>;
  percentage: number;
  phone: string;
  planning: Array<PlanningField>;
  review: string;
  profileImg?: File;
}
