const Hero = () => {
  return (
    <section className="relative bg-background-light py-16 px-8 overflow-hidden">
      {/* Text Section */}
      <div className="max-w-3xl mb-16 z-10 relative">
        <span className="text-secondary text-sm bg-accent py-1 px-3 rounded-full">
          Empowering Academic Success
        </span>
        <h1 className="text-6xl font-bold text-primary mt-6">
          Stay on track, hit milestones and excel in your final year projects
        </h1>
        <p className="text-secondary text-lg mt-4 max-w-96">
          Efficiently manage meetings, track progress, and gain insights into your academic journey with AI-powered analytics.
        </p>
        <div className="mt-8">
          <button className="bg-primary text-background-light py-3 px-6 rounded-lg mr-4 shadow-lg hover:bg-secondary transition-all">
            Get Started
          </button>
          <button className="text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary hover:text-background-light transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* Card Section */}
      <div className="absolute top-64 right-0 flex gap-8 items-start z-0">
        {/* Background Card 1 */}
        <div className="bg-surface-dark w-[400px] h-[300px] rounded-lg bottom-28 absolute left-20 blur-sm p-8">
          <h3 className="text-lg font-semibold text-primary">Meeting Success</h3>
          <p className="text-4xl font-bold text-secondary mt-2">98%</p>
          <p className="text-secondary text-sm mt-1">This week</p>
          <p className="text-muted mt-4">Most students are hitting their meeting goals.</p>
        </div>

        {/* Card 1 */}
        <div className="bg-surface-light p-8 rounded-lg shadow-lg w-72 z-10">
          <h3 className="text-lg font-semibold text-primary">Meeting Success</h3>
          <p className="text-4xl font-bold text-secondary mt-2">98%</p>
          <p className="text-secondary text-sm mt-1">This week</p>
          <p className="text-muted mt-4">Most students are hitting their meeting goals.</p>
        </div>

        {/* Background Card 2 */}
        <div className="bg-surface-light w-[300px] h-[250px] rounded-lg bottom-28 absolute left-70 blur-sm p-8">
          <h3 className="text-lg font-semibold text-primary">Meeting Success</h3>
          <p className="text-4xl font-bold text-secondary mt-2">98%</p>
          <p className="text-secondary text-sm mt-1">This week</p>
          <p className="text-muted mt-4">Most students are hitting their meeting goals.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-dark p-8 rounded-lg shadow-lg w-96 z-10">
          <h3 className="text-lg font-semibold text-background-light">AI-Powered Insights</h3>
          <p className="text-background-light text-sm mt-4">Understand your progress</p>
          <div className="text-background-light text-4xl font-bold mt-4">+20%</div>
          <p className="text-background-light text-sm mt-2">Improvement in milestone completion rates.</p>
        </div>
      </div>
    </section>
  );
};


export default Hero;
