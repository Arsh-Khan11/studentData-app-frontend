export interface StudentInput {
  name: string;
  email: string;
  course: string;
  year: string;
  status: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
export interface Student extends StudentInput {
  id: number;
}