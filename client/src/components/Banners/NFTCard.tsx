import React,{useState} from 'react'
import { FaCoins } from 'react-icons/fa'
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'


function NFTCard({ tokenId,img, title, price }:{ tokenId:string,img:string, title:string, price:string }) {





  return (
    <>
      <div className='flex group flex-col space-y-10 rounded-lg overflow-hidden border border-slate-400/10 pb-8 hover:shadow-xl duration-500 ease-in-out hover:shadow-white/5 relative'>
        {/* Image & Counter */}
        <div className='flex flex-col items-start relative'>
          <img src={img} alt='NFT' className='object-cover' />

        </div>
        {/* Content */}
        <div className='px-6 flex flex-col space-y-3'>
          {/* Title */}
          <h1 className='text-2xl'>{title}</h1>
          {/* Price & Like */}
          <div className='flex justify-between'>
            {/* Price */}
            <div className='flex space-x-2 text-indigo-600 items-center'>
              <FaCoins size={18} />
              <p className='text-2xl font-semibold'>{price} PAS</p>
            </div>
          </div>
        </div>
        {/* Hover */}
        <div className='absolute hidden top-1/4 left-1/3 md:left-1/4 group-hover:flex animate-bounce transition-all ease-in-out duration-1000'>
          <button className='text-sm px-6 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 duration-200 ease-in-out'>
            Buy
          </button>
        </div>
      </div>
    </>
  )
}

export default NFTCard
