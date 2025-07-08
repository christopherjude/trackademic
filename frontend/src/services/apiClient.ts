const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

class ApiClient {
  private msalInstance?: any;
  private account?: any;

  constructor(msalInstance?: any, account?: any) {
    this.msalInstance = msalInstance;
    this.account = account;
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      if (this.msalInstance && this.account) {
        const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
        const request = {
          scopes: [`api://${clientId}/access_as_user`],
          account: this.account,
        };
        
        const response = await this.msalInstance.acquireTokenSilent(request);
        return response.accessToken;
      }
      
      throw new Error("No MSAL instance or account available");
    } catch (error) {
      console.error("Failed to acquire access token:", error);
      throw new Error("Authentication required");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await this.getAccessToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

// Export a global API client instance
export const apiClient = new ApiClient();

// Function to create API client with MSAL integration
export function createApiClient(msalInstance?: any, account?: any) {
  return new ApiClient(msalInstance, account);
}
