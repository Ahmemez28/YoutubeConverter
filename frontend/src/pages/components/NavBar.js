import React from 'react';
import '../../App.css'; // Ensure you import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Youtube Converter</div>
      <div className="nav-links">
        <a className="nav-link" href="../ ">Converter</a>
        <a className="nav-link" href="/video">Video search</a>
      </div>
    </nav>
  );
};

export default Navbar;
