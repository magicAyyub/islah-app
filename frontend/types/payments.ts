export type Payment = {
    id?: number;
    student_id: number;
    class_id: number;
    amount: number;
    date: string;
    status: string;
  }
  
  export type Student = {
    id: number;
    first_name: string;
    last_name: string;
    class_name: string;
    birth_date: string;
  }
  
  export type Class = {
    id: number;
    name: string;
  }
  
  