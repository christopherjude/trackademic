import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClient";

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  student_id: number;
  supervisor_id: number;
  created_at: string;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  supervisor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meeting: Omit<Meeting, "id" | "created_at" | "student" | "supervisor">) => {
    try {
      const newMeeting = await apiClient.createMeeting(meeting);
      setMeetings((prev: Meeting[]) => [...prev, newMeeting]);
      return newMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create meeting");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return {
    meetings,
    loading,
    error,
    refetch: fetchMeetings,
    createMeeting,
  };
}
