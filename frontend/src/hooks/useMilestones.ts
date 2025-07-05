import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClient";

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
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = async () => {
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
    try {
      const newMilestone = await apiClient.createMilestone(milestone) as Milestone;
      setMilestones((prev: Milestone[]) => [...prev, newMilestone]);
      return newMilestone;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create milestone");
    }
  };

  const updateMilestone = async (id: number, updates: Partial<Milestone>) => {
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
    fetchMilestones();
  }, []);

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
    updateMilestone,
  };
}
