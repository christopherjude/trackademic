const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center py-20 bg-background-light">
      <span className="text-secondary py-2 px-4 rounded-full bg-accent text-sm mb-4">Data driven marketing agency</span>
      <h1 className="text-6xl font-bold py-6 text-primary">
        We are <span className="text-secondary">agency</span> that will<br />
        help scale up your business
      </h1>
      <p className="text-neutral-light max-w-3xl mb-8">
        Creating Meaningful Connections with Your Audience Through Engaging and Impactful Content.
      </p>
      <div className="flex space-x-4">
        <button className="bg-primary text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all">Get Started</button>
        <button className="border border-primary text-primary py-3 px-6 rounded-lg shadow-lg hover:bg-secondary hover:text-background-light transition-all">Learn More</button>
      </div>
    </section>
  );
};

export default Hero;