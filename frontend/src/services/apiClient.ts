const API_BASE_URL = "http://localhost:8000/api";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getCurrentUser(userId: number) {
    return this.request(`/users/me?user_id=${userId}`);
  }

  async getStudents() {
    return this.request('/users/students');
  }

  // Meeting endpoints
  async getMeetings() {
    return this.request('/meetings');
  }

  async createMeeting(meeting: any) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
  }

  async getMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}`);
  }

  // Meeting workflow endpoints
  async checkIntoMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/checkin`, {
      method: 'POST',
    });
  }

  async confirmMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/confirm`, {
      method: 'POST',
    });
  }

  async endMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/end`, {
      method: 'POST',
    });
  }

  async markMeetingMissed(meetingId: number) {
    return this.request(`/meetings/${meetingId}/mark-missed`, {
      method: 'POST',
    });
  }


}

export const apiClient = new ApiClient();
export default apiClient;
