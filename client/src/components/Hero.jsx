import React from 'react'
import Typed from 'react-typed';

const Hero = () => {
  return (
    <div className='text-white'>
        <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
            <p className='text-[#00df9a] font-bold p-2'>MATH PROBLEMS? SOLVED!</p>
            <h1 className='md:text-5xl sm:text-4xl text-3xl font-bold md:py-6'>Fun and easy !</h1>
            <div className='flex justify-center items-center '>
                <p className='md:text-4xl sm:text-3xl text-sl font-bold py-4'>Fast and flexible for</p>
                <Typed className='md:text-4xl sm:text-3xl text-sl font-bold text-[#00df9a] pl-2' strings={['Elementary math','Algebra','Trigonometry']} typeSpeed={140} backSpeed={160} loop/>
            </div>
            <p className='md:text-2xl text-xl font-bold text-gray-500'>You can quickly and easily solve math problems by simply taking a photo of the problem</p>
            <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3 text-black'>Get started</button>
        </div>
    </div>
  )
}

export default Hero