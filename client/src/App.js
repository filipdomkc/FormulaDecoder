import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DropIn from "./components/DropIn";
import About from "./components/About";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Hero/>
      <About/>
      <DropIn/>
      <Footer/>
    </div>
  );
}

export default App;
