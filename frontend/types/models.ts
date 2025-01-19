export interface Student {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  guardian_ids?: number[];
  class_id: number;
}

export interface Parent {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "father" | "mother" | "guardian";
}

export interface Class {
  id: number;
  name: string;
  capacity: number;
  registered: number;
}

export interface Enrollment {
  student_id: number;
  class_id: number;
  status: "active" | "inactive" | "pending";
}

