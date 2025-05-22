import NotificationsCard from "./NotificationsCard";
import AnalyticsCard from "./AnalyticsCard";
import SuggestionsCard from "./SuggestionsCard";

const SupervisorsSection = () => {
  return (
    <section className="mt-16 px-5 text-center">
      <h2 className="text-4xl font-bold text-primary mb-12">And Supervisors</h2>
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center" >
        <NotificationsCard />
        <AnalyticsCard />
        <SuggestionsCard />
      </div>
    </section>
  );
};

export default SupervisorsSection;

