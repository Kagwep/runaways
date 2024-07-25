import React, { useEffect, useState } from 'react'
import { Contract } from 'starknet';
import { runawayMarketPlaceAbi, runawayMarketplaceContractAddress } from '../../../config/config';
import { provider } from '../../../config/constants';
import { useAppContext } from '../../../providers/AppProvider';
import { Link } from 'react-router-dom';
import { feltToString } from '../../../config/utils';

const RunawaysMarketPlace = () => {

    const [runawaysOnMarketplace , setRunawaysOnMarketplace] = useState<any>([])

    const { 
        address,
        connection, 
        connectWallet,
        connectTokenbound,
        disconnectTokenbound ,
        contract,
        disconnectWallet,
        chainId,account,
        erc20_contract,
        tokens_contract, 
        runaways_contract, 
        runaway_ownership_contract,
        tokenBoundAccount,
        tokenBoundAddress,
        tokenBoundConnection,
        } = useAppContext();

    const svgUrl: string = '/runaway.svg';
    console.log(svgUrl)


    const get_user_runaways = async () => {

        const runaway_marketplace_contract = new Contract(runawayMarketPlaceAbi, runawayMarketplaceContractAddress,provider)

        const runaways = await runaway_marketplace_contract.get_all_runaways();
  
        console.log("runaways: ", runaways)
  
        const response = await fetch(svgUrl);
         const svg = await response.text();
  
          runaways.forEach((new_runaway: any) => {

            console.log("...",new_runaway.runaway)

            const genes = new_runaway.runaway.genes;

            console.log("....",genes)
          
          const modifiedSvg = changePathFillType(svg, genes);
          new_runaway.svg = modifiedSvg;
  
          console.log(".....",new_runaway)
         
        });
  
        setRunawaysOnMarketplace([...runaways]);
          
      }
  
      const changePathFillType = (svgString: any, genes: any) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        console.log(svgDoc)
      
        Object.keys(genes).forEach((geneKey) => {
          const gene = genes[geneKey];
          const pathId = geneKey; // assume path ID is the same as the gene key
          
          const pathElements = svgDoc.querySelectorAll(`.${pathId}`);
          if (pathElements) {
            pathElements.forEach((pathElement, index) => {
              const rgb = [gene.r, gene.g, gene.b].map((val) => val.toString(16).padStart(2, '0')).join('');
              pathElement.setAttribute('fill', `#${rgb}`);
            })
          }
        });
  
        const  svcontent = new XMLSerializer().serializeToString(svgDoc.documentElement)
      
        return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svcontent )))}`;
      };

      useEffect(() => {

        const fetchRunaways = async () => {
          await get_user_runaways();
        };
         
        fetchRunaways();
  
      },[connection])
  

  return (
    <>
    
    {
          runawaysOnMarketplace.length > 0 ?
           (
              
            <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Runaways On Marketplace</h2>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {runawaysOnMarketplace.map((runaway: any, index: any ) => (
                   <Link to={`/runaway/${1}`} key={index} className="group relative block">
                    <div key={index} className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                        <img
                          alt={runaway.imageAlt}
                          src={`${runaway.svg}`}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                              <span aria-hidden="true" className="absolute inset-0" />
                              Created: <span className='text-orange-800'>{new Date(runaway.runaway.created_at.toString() * 1000).toLocaleString()}</span>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">experience: <span className='text-cyan-400'>{runaway.runaway.experience.toString()} </span></p>
                        </div>
                 
                      </div>

                      <p className="text-sm font-medium text-gray-900 py-2"><span className='text-slate-500'>{feltToString(runaway.price)}</span> ETH</p>

                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" >
                                Buy
                    </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
         </div>
            

          ) :
           (

            <p> No Runaways Available</p>

          )
         }
    </>
  )
}

export default RunawaysMarketPlace