const API_BASE_URL = "http://127.0.0.1:8000"

class SchoolAPI {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (response.status === 401) {
      throw new Error("Authentication required")
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || "API Error")
    }

    return response.json()
  }

  // Authentication
  async login(username: string, password: string) {
    return this.apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getCurrentUser() {
    return this.apiCall("/auth/me")
  }

  // Students
  async getStudents(page = 1, size = 20, search = "", filters: Record<string, any> = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value !== "all") {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>),
    })
    return this.apiCall(`/students/?${params}`)
  }

  async createStudent(studentData: any) {
    return this.apiCall("/students/", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  async updateStudent(id: number, studentData: any) {
    return this.apiCall(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    })
  }

  async getStudent(id: number) {
    return this.apiCall(`/students/${id}`)
  }

  async deleteStudent(id: number) {
    return this.apiCall(`/students/${id}`, {
      method: "DELETE",
    })
  }

  async expelStudent(id: number, reason: string) {
    return this.apiCall(`/students/${id}/expel?reason=${encodeURIComponent(reason)}`, {
      method: "POST",
    })
  }

  async flagStudent(id: number, flagType: string, reason: string) {
    return this.apiCall(`/students/${id}/flag?flag_type=${encodeURIComponent(flagType)}&reason=${encodeURIComponent(reason)}`, {
      method: "POST",
    })
  }

  async unflagStudent(id: number) {
    return this.apiCall(`/students/${id}/flag`, {
      method: "DELETE",
    })
  }

  // Statistics
  async getStudentStatistics() {
    return this.apiCall("/stats/students")
  }

  // Parents
  async getParents() {
    return this.apiCall("/parents/")
  }

  async createParent(parentData: any) {
    return this.apiCall("/parents/", {
      method: "POST",
      body: JSON.stringify(parentData),
    })
  }

  async updateParent(id: number, parentData: any) {
    return this.apiCall(`/parents/${id}`, {
      method: "PUT",
      body: JSON.stringify(parentData),
    })
  }

  // Classes
  async getClasses() {
    return this.apiCall("/classes/simple")
  }

  async createClass(classData: any) {
    return this.apiCall("/classes/", {
      method: "POST",
      body: JSON.stringify(classData),
    })
  }

  // Payments
  async getPayments(page = 1, size = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    return this.apiCall(`/payments/?${params}`)
  }

  async createPayment(paymentData: any) {
    return this.apiCall("/payments/", {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  // Academic Management
  async getSubjects(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.apiCall(`/academic/subjects/?${params}`)
  }

  async createSubject(subjectData: any) {
    return this.apiCall("/academic/subjects/", {
      method: "POST",
      body: JSON.stringify(subjectData),
    })
  }

  async recordGrade(gradeData: any) {
    return this.apiCall("/academic/grades/", {
      method: "POST",
      body: JSON.stringify(gradeData),
    })
  }

  async getStudentGrades(studentId: number, filters = {}) {
    const params = new URLSearchParams(filters)
    return this.apiCall(`/academic/students/${studentId}/grades?${params}`)
  }

  async recordAttendance(attendanceData: any) {
    return this.apiCall("/academic/attendance/", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    })
  }

  async getStudentAttendance(studentId: number, filters = {}) {
    const params = new URLSearchParams(filters)
    return this.apiCall(`/academic/students/${studentId}/attendance?${params}`)
  }
}

export const api = new SchoolAPI()
