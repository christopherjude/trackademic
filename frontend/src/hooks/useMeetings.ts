import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  status?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  actual_duration_minutes?: number;
  meeting_summary?: string;
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
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMeetings() as Meeting[];
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meeting: Omit<Meeting, "id" | "created_at" | "student" | "supervisor" | "meeting_summary">) => {
    try {
      const newMeeting = await apiClient.createMeeting(meeting) as Meeting;
      await fetchMeetings();
      return newMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create meeting");
    }
  };

  const startMeeting = async (meetingId: number) => {
    try {
      const updatedMeeting = await apiClient.startMeeting(meetingId) as Meeting;
      await fetchMeetings();
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to start meeting");
    }
  };

  const updateMeetingSummary = async (meetingId: number, summary: string) => {
    try {
      const updatedMeeting = await apiClient.updateMeetingSummary(meetingId, summary) as Meeting;
      setMeetings((prev: Meeting[]) => 
        prev.map(meeting => meeting.id === meetingId ? updatedMeeting : meeting)
      );
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update meeting summary");
    }
  };

  const checkIntoMeeting = async (meetingId: number) => {
    try {
      const updatedMeeting = await apiClient.checkIntoMeeting(meetingId) as Meeting;
      setMeetings((prev: Meeting[]) => 
        prev.map(meeting => meeting.id === meetingId ? updatedMeeting : meeting)
      );
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to check into meeting");
    }
  };

  const confirmMeeting = async (meetingId: number) => {
    try {
      const updatedMeeting = await apiClient.confirmMeeting(meetingId) as Meeting;
      setMeetings((prev: Meeting[]) => 
        prev.map(meeting => meeting.id === meetingId ? updatedMeeting : meeting)
      );
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to confirm meeting");
    }
  };

  const endMeeting = async (meetingId: number, summary?: string) => {
    try {
      const updatedMeeting = await apiClient.endMeeting(meetingId, summary) as Meeting;
      await fetchMeetings();
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to end meeting");
    }
  };

  const markMeetingMissed = async (meetingId: number) => {
    try {
      const updatedMeeting = await apiClient.markMeetingMissed(meetingId) as Meeting;
      setMeetings((prev: Meeting[]) => 
        prev.map(meeting => meeting.id === meetingId ? updatedMeeting : meeting)
      );
      return updatedMeeting;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to mark meeting as missed");
    }
  };

  const fetchMeetingHistory = () => {
    return meetings
      .filter(meeting => {
        const meetingTime = new Date(meeting.scheduled_at);
        const meetingEndTime = new Date(meetingTime.getTime() + (meeting.duration_minutes * 60 * 1000));
        const now = new Date();
        const status = (meeting.status || '').toLowerCase();
        
        // Include meetings that are:
        // 1. Explicitly completed or missed
        // 2. Past meetings that haven't been started (pending/scheduled past their time window)
        const isExplicitlyFinished = status === 'completed' || status === 'missed';
        const isPastTimeWindow = now > meetingEndTime && (status === 'pending' || status === 'scheduled');
        
        return isExplicitlyFinished || isPastTimeWindow;
      })
      .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
      .slice(0, 10);
  };

  const getInProgressMeeting = () => {
    return meetings.find(
      (meeting) => (meeting.status || '').toLowerCase() === 'in_progress'
    );
  };

  useEffect(() => {
    if (apiClient) {
      fetchMeetings();
    }
  }, [apiClient]);

  return {
    meetings,
    loading,
    error,
    refetch: fetchMeetings,
    createMeeting,
    startMeeting,
    updateMeetingSummary,
    checkIntoMeeting,
    confirmMeeting,
    endMeeting,
    markMeetingMissed,
    fetchMeetingHistory,
    getInProgressMeeting,
  };
}
