import NFTCardsList from './NFTCardsList'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { motion } from 'framer-motion'
import {
  parentNFTVariants,
  parentVariants,
  childVariants,
} from '../../animations/banners'
function Banners() {
  const styles = {
    bgGradient:
      'bg-gradient-to-br to-orange-600/20 via-fuchsia-600/20 from-indigo-600/20',
    btn: 'px-5 text-center rounded-md font-medium border-indigo-200 py-2 bg-indigo-600 hover:bg-indigo-500 hover:border-indigo-700 text-3xl',
  }
  return (
    <>
      <section className='p-4 pb-24 text-white'>
        <div className='container max-w-screen-lg mx-auto overflow-hidden'>
          <div className='flex flex-col items-center space-y-8'>
            {/* Content */}
            
            <motion.div
              variants={parentVariants}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='flex flex-col items-center space-y-4 '
            >
              <motion.h1
                variants={childVariants}
                className='text-5xl md:text-5xl font-medium'
              >
                Explore Banners
              </motion.h1>
              <motion.p
                variants={childVariants}
                className='text-slate-400 max-w-lg text-center text-2xl'
              >
                A marketplace dedicated to acquiring  runawyas and runaway skins
              </motion.p>
            </motion.div>
            {/* Collection of NFTs */}
            <motion.div
              variants={parentNFTVariants}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true }}
              className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'
            >
              {/* Card 1 */}
              <NFTCardsList />
            </motion.div>
            <div className='md:flex items-center space-x-2 text-slate-400 font-semibold hidden  '>
              <p className='text-2xl'>Explore All Items</p>
              <AiOutlineArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Banners
