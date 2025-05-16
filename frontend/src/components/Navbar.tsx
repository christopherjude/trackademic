const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-6 px-10 bg-background-light">
      <div className="text-2xl font-bold text-primary">Trackademic</div>
      <ul className="flex space-x-8">
        <li><a href="#" className="text-secondary hover:text-primary">Home</a></li>
        <li><a href="#" className="text-secondary hover:text-primary">Project</a></li>
        <li><a href="#" className="text-secondary hover:text-primary">Work</a></li>
        <li><a href="#" className="text-secondary hover:text-primary">About Us</a></li>
      </ul>
      <button className="bg-primary text-background-light py-2 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all">Contact Us</button>
    </nav>
  );
};

export default Navbar;