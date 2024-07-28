import React from "react";
import "../App.css"; // Create a CSS file for styles
import icon from "./images/image.png"; // Ensure the correct path to your icon image
import Navbar from "./components/NavBar";
function Home() {
  return (
    <div className="App">
      <Navbar />

      <header className="App-header">
      

        <p className="footer">Created by Ahmed</p>
      </header>
    </div>
  );
}
export default Home;
