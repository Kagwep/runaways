import React,{useState,useEffect,useCallback} from 'react';
import NFTCard from './NFTCard'
import { motion } from 'framer-motion'


function NFTCardsList() {
  const parentVariants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.1 },
    },
  }
  const childVariants = {
    hidden: {
      x: 100,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
      // transition: { delay: 0.1 },
    },
  }

  const [banners, setBanners] = useState([]);
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()


  return (
    <>
      {banners.map((banner, idx) => {
        return (
          <motion.div variants={childVariants} key={idx}>
            <NFTCard
              key={banner.id}
              tokenId={banner.tokenId}
              img={banner.tokenUri}
              title={banner.title}
              price={banner.price}
            />
          </motion.div>
        )
      })}
    </>
  )
}

export default NFTCardsList
