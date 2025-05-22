import MilestonesCard from "./MilestonesCard";
import MeetingsCard from "./MeetingsCard";
import ActionablesCard from "./ActionablesCard";

const StudentsSection = () => {
  return (
    <section className="mt-8 px-5 text-center">
      {/* Section Title */}
      <h2 className="text-3xl font-semibold text-primary mb-12">
        For Students
      </h2>

      {/* Cards Container */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        <MeetingsCard />
        <MilestonesCard />
        <ActionablesCard />
      </div>
    </section>
  );
};

export default StudentsSection;

