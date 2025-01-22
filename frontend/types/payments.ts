export type Payment = {
    id?: number;
    student_id: number;
    method: string;
    amount: number;
    due_date: string;
    description: string;  
  }
  
  export type Student = {
    id: number;
    first_name: string;
    last_name: string;
    class_name: string;
    birth_date: string;
  }
  
  export type Method = {
    cash: string;
    card: string;
    cheque: string;
  }
  
  