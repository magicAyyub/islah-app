const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface RegisterData {
  username: string;
  password: string;
  full_name: string;
  role: 'admin' | 'staff' | 'teacher' | 'parent';
  email?: string;
  phone_number?: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface UserData {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at?: string; // Make it optional
}

interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: UserData;
  };
  message: string;
}

export async function register(data: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Une erreur est survenue lors de l\'inscription');
  }

  return response.json();
}

export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    console.log('Attempting login with:', { ...data, password: '****' });
    const url = `${API_BASE_URL}/auth/login`;
    console.log('API URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'same-origin'
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.detail || 'Failed to login');
    }

    const responseData = await response.json();
    console.log('Login response:', responseData);

    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check if the server is running.');
    }
    throw error;
  }
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la déconnexion');
  }

  return response.json();
}

export async function searchParents(query: string) {
  const response = await fetch(`${API_BASE_URL}/parent?skip=0&limit=100&name=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de parent');
  }
  return response.json();
}

export async function createParent(parentData: any) {
  const response = await fetch(`${API_BASE_URL}/parents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(parentData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erreur lors de la création du parent');
  }
  return response.json();
} 