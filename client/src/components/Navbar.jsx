import React, {useState} from 'react'
import {AiOutlineClose,AiOutlineMenu} from 'react-icons/ai'
import { Link } from 'react-scroll'

const Navbar = () => {

    const [nav, setNav]=useState(true)

    const handleNav=()=>{
        setNav(!nav)
    }

  return (
    <div className='flex text-white bg-black items-center h-24 justify-between mx-auto px-4 fixed top-0 left-0 w-full'>
        <h1 className='w-full text3xl font-bold text-[#00df9a]'>FORMULA<strong>DECODER</strong>.</h1>
        <ul className='hidden md:flex'>
            <li className='p-4 hover:cursor-pointer'><Link to="Home" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Home</Link></li>
            <li className='p-4 hover:cursor-pointer'><Link  to="DropIn" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Solve</Link></li>
            <li className='p-4 hover:cursor-pointer'><Link  to="About" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>About</Link></li>
            <li className='p-4 hover:cursor-pointer'><Link to="Contact" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Contact</Link></li>
        </ul>
        <div onClick={handleNav} className='block md:hidden'>
            {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>} 
        </div>
        <div className={!nav ? 'fixed left-0 top-0 w-[45%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'fixed left-[-100%]'}>
            <h1 className='w-full text3xl font-bold text-[#00df9a] m-4'>FORMULA<strong>DECODER</strong>.</h1>
            <ul className='uppercase'>
                <li className='p-4 border-b border-gray-600 hover:cursor-pointer'><Link to="Home" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Home</Link></li>
                <li className='p-4 border-b border-gray-600 hover:cursor-pointer'><Link  to="DropIn" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Solve</Link></li>
                <li className='p-4 border-b border-gray-600 hover:cursor-pointer'><Link  to="About" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>About</Link></li>
                <li className='p-4 hover:cursor-pointer'><Link to="Contact" spy={true} smooth={true} offset={50} duration={500} activeClass='text-[#00df9a]'>Contact</Link></li>
            </ul>
        </div>
    </div> 
  )
}

export default Navbar