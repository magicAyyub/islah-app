import { Student, Parent, Enrollment } from '@/types/models';

export async function createGuardian(guardianData: Omit<Parent, 'id'>) {
    const response = await fetch('/api/guardians', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guardianData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Guardian creation error:', errorData);
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((error: any) => `${error.loc[1]}: ${error.msg}`);
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(errorData.detail || 'Failed to create guardian');
    }
    
    return response.json();
  }
  
  export async function createStudent(studentData: { register_data: Omit<Student, 'id'> }) {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Student creation error:', errorData);
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((error: any) => `${error.loc[1]}: ${error.msg}`);
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(errorData.detail || 'Failed to create student');
    }
    
    return response.json();
  }
  
  export async function createEnrollment(enrollmentData: Enrollment) {
    const response = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollmentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Enrollment creation error:', errorData);
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((error: any) => `${error.loc[1]}: ${error.msg}`);
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(errorData.detail || 'Failed to create enrollment');
    }
    
    return response.json();
  }
  
  