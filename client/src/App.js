import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DropIn from "./components/DropIn";
import About from "./components/About";
import Footer from "./components/Footer";
import Contact from "./components/Contact";


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Hero/>
      <About/>
      <DropIn/>
      <Contact className='flex justify-center'/>
      <Footer/>
    </div>
  );
}

export default App;
