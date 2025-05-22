import Hero from "@/components/Hero";
import StudentsSection from "@/components/home/students/StudentsSection";
import SupervisorsSection from "../components/home/supervisors/SupervisorsSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <StudentsSection/>
      <SupervisorsSection/>
    </div>
  );
};

export default Home;
