import React from 'react'
import '../styles/svgStyles.css'; // Import the CSS file
import Lottie from 'lottie-react'
import animationData from '../assets/98991-exams-preparation.json'

const About = () => {
 
  return (
    <div className='w-full h-screen bg-[#00df9a] py-16-px-4 flex items-center justify-center' id='About'>
        <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
            <Lottie animationData={animationData}/>
            <div className='my-auto'>
                <p className='flex flex-column justify-center font-bold' >HOW TO DO IT</p>
                <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>MATH PROBLEM - SCAN - SOLVE</h1>
                <p>With just a photo, we'll solve your math problems in seconds. Say goodbye to frustrating calculations and hello to effortless learning. Try now!</p>
                <button className='bg-black w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 text-[#00df9a]'><a href='#DropIn'>Get started</a></button>
            </div>
        </div>
    </div>
  )
}

export default About