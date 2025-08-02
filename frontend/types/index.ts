export interface User {
  id: number
  username: string
  first_name?: string
  last_name?: string
  email?: string
  role: string
  is_active: boolean
}

export interface Parent {
  id: number
  first_name: string
  last_name: string
  phone: string
  email?: string
  address?: string
  emergency_contact?: string
}

export interface Class {
  id: number
  name: string
  description?: string
  capacity: number
  schedule?: string
  teacher_id?: number
  academic_year: string
}

export interface StudentFlag {
  id: number
  flag_type: string
  reason: string
  flagged_date: string
  is_active: boolean
}

export interface Student {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  place_of_birth?: string
  gender: string
  parent_id: number
  class_id?: number
  registration_status?: string
  registration_date?: string
  academic_year: string
  registered_by?: number
  parent?: Parent
  class?: Class
  flags?: StudentFlag[]
}

export interface Payment {
  id: number
  student_id: number
  amount: number
  payment_date: string
  payment_type: string
  payment_method: string
  description?: string
  receipt_number?: string
  student?: Student
}

export interface Subject {
  id: number
  name: string
  code: string
  description?: string
  teacher_id?: number
  class_id?: number
  academic_year: string
}

export interface Grade {
  id: number
  student_id: number
  subject_id: number
  grade_value: number
  max_grade: number
  grade_type: string
  academic_period: string
  academic_year: string
  assessment_date: string
  comments?: string
  recorded_by?: number
}

export interface Attendance {
  id: number
  student_id: number
  class_id: number
  attendance_date: string
  status: string
  arrival_time?: string
  notes?: string
  recorded_by?: number
}
