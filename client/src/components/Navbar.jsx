import React, {useState} from 'react'
import {AiOutlineClose,AiOutlineMenu} from 'react-icons/ai'

const Navbar = () => {

    const [nav, setNav]=useState(true)

    const handleNav=()=>{
        setNav(!nav)
    }

  return (
    <div className='flex text-white items-center h-24 justify-between max-w-[1240px] mx-auto px-4'>
        <h1 className='w-full text3xl font-bold text-[#00df9a]'>FORMULA<strong>DECODER</strong>.</h1>
        <ul className='hidden md:flex'>
            <li className='p-4'>Home</li>
            <li className='p-4'>Solve</li>
            <li className='p-4'>About</li>
            <li className='p-4'>Contact</li>
        </ul>
        <div onClick={handleNav} className='block md:hidden'>
            {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>} 
        </div>
        <div className={!nav ? 'fixed left-0 top-0 w-[45%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'fixed left-[-100%]'}>
            <h1 className='w-full text3xl font-bold text-[#00df9a] m-4'>FORMULA<strong>DECODER</strong>.</h1>
            <ul className='uppercase'>
                <li className='p-4 border-b border-gray-600'>Home</li>
                <li className='p-4 border-b border-gray-600'>Solve</li>
                <li className='p-4 border-b border-gray-600'>About</li>
                <li className='p-4'>Contact</li>
            </ul>
        </div>
    </div> 
  )
}

export default Navbar