import { useState, useEffect } from "react";
import { useMeetings } from "../../hooks/useMeetings";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../services/apiClient";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentId?: number;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const ScheduleMeetingModal = ({ isOpen, onClose, selectedStudentId }: ScheduleMeetingModalProps) => {
  const { user } = useAuth();
  const { createMeeting, loading } = useMeetings();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
    duration_minutes: 60,
    location: "",
    student_id: selectedStudentId || "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      if (isOpen) {
        setLoadingStudents(true);
        try {
          const studentsData = await apiClient.getStudents() as Student[];
          setStudents(studentsData);
        } catch (error) {
          console.error('Failed to fetch students:', error);
        } finally {
          setLoadingStudents(false);
        }
      }
    };

    fetchStudents();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if user is supervisor or director
      if (user?.role !== 'supervisor' && user?.role !== 'director') {
        throw new Error('Only supervisors can schedule meetings');
      }
      
      if (!formData.student_id) {
        throw new Error('Please select a student');
      }
      
      console.log('Creating meeting with data:', {
        ...formData,
        student_id: parseInt(formData.student_id.toString()),
        supervisor_id: user.id,
        scheduled_at: formData.scheduled_at,
      });
      
      const newMeeting = await createMeeting({
        ...formData,
        student_id: parseInt(formData.student_id.toString()),
        supervisor_id: user.id,
        scheduled_at: formData.scheduled_at,
      });
      
      console.log('Meeting created successfully:', newMeeting);
      
      onClose();
      setFormData({
        title: "",
        description: "",
        scheduled_at: "",
        duration_minutes: 60,
        location: "",
        student_id: selectedStudentId || "",
      });
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      alert(`Failed to schedule meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Schedule New Meeting</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary hover:bg-surface-light rounded-lg p-2 transition-all text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Meeting Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., Weekly Progress Review"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Student</label>
            <select
              required
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={loadingStudents}
            >
              <option value="">
                {loadingStudents ? "Loading students..." : "Select a student"}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              style={{
                colorScheme: 'light'
              }}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Duration (minutes)</label>
            <select
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., Office 204, Video Call, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 text-primary bg-white border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Agenda, topics to discuss, etc."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-secondary bg-white border border-neutral-light rounded-lg hover:bg-surface-light hover:text-primary transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-background-light rounded-lg hover:bg-secondary transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;
