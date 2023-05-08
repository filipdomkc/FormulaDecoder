import React from 'react';
import {
  FaLinkedin,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300' id='Footer'>
      <div>
        <h1 className='w-full text3xl font-bold text-[#00df9a]'>FORMULA<strong>DECODER</strong>.</h1>
        <p className='py-4'>Say goodbye to frustrating calculations and hello to effortless learning</p>
        <div className='flex justify-between md:w-[75%] my-6'>
            <a href='https://www.linkedin.com/in/filip-domovi%C4%87-b89588152/'>
              <FaLinkedin size={30} />
            </a>
            <a href='https://www.instagram.com/filip.dom/'>
              <FaInstagram size={30} />
              </a>
            <FaTwitterSquare size={30} /> 
            <a href='https://github.com/filipdomkc'>
              <FaGithubSquare size={30} />
            </a>
        </div>
      </div>
      <div className='lg:col-span-2 flex justify-between mt-6'>
    <div>
        <h6 className='font-medium text-gray-400'>Solutions</h6>
        <ul>
            <li className='py-2 text-sm'>Elementary math</li>
            <li className='py-2 text-sm'>Algebra</li>
            <li className='py-2 text-sm'>Trigonometry</li>
            <li className='py-2 text-sm'>Geometry</li>
        </ul>
    </div>
    <div>
        <h6 className='font-medium text-gray-400'>Support</h6>
        <ul>
            <li className='py-2 text-sm'>Documentation</li>
            <li className='py-2 text-sm'>Guides</li>
            <li className='py-2 text-sm'>API Status</li>
        </ul>
    </div>
    <div>
        <h6 className='font-medium text-gray-400'>Legal</h6>
        <ul>
            <li className='py-2 text-sm'>Claim</li>
            <li className='py-2 text-sm'>Policy</li>
            <li className='py-2 text-sm'>Terms</li>
        </ul>
    </div>
      </div>
      <div class="border-t border-gray-300 py-4">
        <p class="text-sm text-gray-600">&copy; 2023 FORMULADECODER. by FD. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;