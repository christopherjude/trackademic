const API_BASE_URL = "http://localhost:8000/api";

class ApiClient {
  private msalInstance?: any;
  private account?: any;

  constructor(msalInstance?: any, account?: any) {
    this.msalInstance = msalInstance;
    this.account = account;
  }

  private async getAccessToken(): Promise<string> {
    try {
      if (this.msalInstance && this.account) {
        // Try to acquire token silently
        const request = {
          scopes: ["User.Read"], // Add your API scopes here
          account: this.account,
        };
        
        const response = await this.msalInstance.acquireTokenSilent(request);
        return response.accessToken;
      }
      
      // For development without MSAL, return a mock token
      // In production, this should throw an error
      console.warn("Using mock token for development");
      return "mock-token";
    } catch (error) {
      console.error("Failed to acquire access token:", error);
      // For development, fallback to mock token
      return "mock-token";
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/users/me");
  }

  // Meeting endpoints
  async getMeetings() {
    return this.request("/meetings");
  }

  async createMeeting(meeting: any) {
    return this.request("/meetings", {
      method: "POST",
      body: JSON.stringify(meeting),
    });
  }

  // Milestone endpoints
  async getMilestones() {
    return this.request("/milestones");
  }

  async createMilestone(milestone: any) {
    return this.request("/milestones", {
      method: "POST",
      body: JSON.stringify(milestone),
    });
  }

  async updateMilestone(id: number, updates: any) {
    return this.request(`/milestones/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Meeting workflow endpoints
  async checkIntoMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/checkin`, {
      method: "POST",
    });
  }

  async confirmMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/confirm`, {
      method: "POST",
    });
  }

  async endMeeting(meetingId: number) {
    return this.request(`/meetings/${meetingId}/end`, {
      method: "POST",
    });
  }

  async markMeetingMissed(meetingId: number) {
    return this.request(`/meetings/${meetingId}/mark-missed`, {
      method: "POST",
    });
  }
}

// Export a simple API client for now
export const apiClient = new ApiClient();

// For MSAL integration, you can create this hook later
export function createApiClient() {
  return new ApiClient();
}
