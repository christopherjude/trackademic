import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export interface Milestone {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  status: "pending" | "in_progress" | "completed";
  user_id: number;
  created_at: string;
  completed_at?: string;
}

export function useMilestones() {
  const { apiClient } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = async () => {
    if (!apiClient) {
      setError("API client not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMilestones() as Milestone[];
      setMilestones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch milestones");
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async (milestone: Omit<Milestone, "id" | "created_at" | "completed_at" | "status">) => {
    if (!apiClient) throw new Error("API client not available");
    
    try {
      const newMilestone = await apiClient.createMilestone(milestone) as Milestone;
      setMilestones((prev: Milestone[]) => [...prev, newMilestone]);
      return newMilestone;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create milestone");
    }
  };

  const updateMilestone = async (id: number, updates: Partial<Milestone>) => {
    if (!apiClient) throw new Error("API client not available");
    
    try {
      const updatedMilestone = await apiClient.updateMilestone(id, updates) as Milestone;
      setMilestones((prev: Milestone[]) => 
        prev.map(milestone => milestone.id === id ? updatedMilestone : milestone)
      );
      return updatedMilestone;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update milestone");
    }
  };

  useEffect(() => {
    if (apiClient) {
      fetchMilestones();
    }
  }, [apiClient]);

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
    updateMilestone,
  };
}
