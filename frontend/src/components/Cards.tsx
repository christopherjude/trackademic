const Cards = () => {
  return (
    <section className="flex flex-wrap justify-center gap-8 py-16 bg-background-light">
      <div className="bg-surface-light p-6 rounded-lg shadow-lg text-primary w-80">
        <p className="text-lg font-bold">Strategic Marketing</p>
        <p className="text-muted mt-2">Solutions for a connected business</p>
        <div className="mt-4 bg-accent py-2 px-4 rounded-lg text-background-dark">2000+</div>
      </div>
      <div className="bg-surface-light p-6 rounded-lg shadow-lg text-primary w-80">
        <p className="text-lg font-bold">Congrats!</p>
        <p className="text-muted mt-2">These slogans aim to convey success.</p>
        <div className="mt-4 bg-accent py-2 px-4 rounded-lg text-background-dark">$15.6</div>
      </div>
    </section>
  );
};

export default Cards;