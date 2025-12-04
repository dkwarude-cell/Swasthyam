import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  token?: string;
  errors?: Record<string, string>;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  medicalHistory?: Array<{ condition: string; severity: string }>;
  mealsPerDay?: string;
  frequencyToEatOutside?: string;
  foodieLevel?: string;
  dietaryPreference?: string;
  preferredCookingStyle?: string;
  currentOils?: string[];
  monthlyOilConsumption?: number;
  oilBudget?: string;
  language?: string;
  isOnboardingComplete?: boolean;
  onboardingStep?: number;
  dailyOilLimit?: number;
  healthRiskLevel?: number;
  avatar?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OnboardingData {
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  medicalHistory?: Array<{ condition: string; severity: string }>;
  reportType?: string;
  mealsPerDay?: string;
  frequencyToEatOutside?: string;
  foodieLevel?: string;
  dietaryPreference?: string;
  preferredCookingStyle?: string;
  currentOils?: string[];
  monthlyOilConsumption?: number;
  oilBudget?: string;
}

class ApiService {
  private token: string | null = null;
  private timeout: number = 15000; // 15 second timeout

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`[API] Calling: ${url}`); // Debug log
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const data = await response.json();
      console.log(`[API] Response:`, data); // Debug log

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[API] Request error:', error);
      
      // Check if it's a timeout/abort error
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timed out. Please check your network connection and try again.',
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async signup(data: SignupData): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.ME, {
      method: 'GET',
    });
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async completeOnboarding(data: OnboardingData): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.AUTH.COMPLETE_ONBOARDING, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
