import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ScheduleMeetingModal from "./ScheduleMeetingModal";

const ScheduleMeetingButton = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Only show for supervisors and directors
  if (user?.role !== 'supervisor' && user?.role !== 'director') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 bg-primary text-background-light text-sm font-medium rounded-lg hover:bg-secondary transition-all shadow-lg"
      >
        <span className="mr-2">📅</span>
        Schedule Meeting
      </button>
      
      <ScheduleMeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ScheduleMeetingButton;
