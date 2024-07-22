import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../providers/AppProvider';
import { Contract } from 'starknet';
import { runawayMarketPlaceAbi, runawayMarketplaceContractAddress } from '../../../config/config';
import { provider } from '../../../config/constants';
import { feltToString } from '../../../config/utils';

const KofiaMarketPlace = () => {

    const [kofiasOnMarketPlace, setSkinsOnMarketplace] = useState<any | null>(null)

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

    const svgUrl: string = '/kofia.svg';


    const get_all_kofias = async () => {

        const runaway_marketplace_contract = new Contract(runawayMarketPlaceAbi, runawayMarketplaceContractAddress,provider)

        const kofias = await runaway_marketplace_contract.get_all_kofias();
  
        console.log("kofias: ", kofias)
  
        const response = await fetch(svgUrl);
        const svg = await response.text();

        const pathId = "kofia_color";

        kofias.forEach((kofia: any) => {
        
            const modifiedSvg = changeSkinPathFillType(svg, kofia.kofia.color,pathId);
            kofia.svg = modifiedSvg;
    
            console.log(".....",kofia)
           
          });

  
        setSkinsOnMarketplace([...kofias]);
          
      }

      const changeSkinPathFillType = (svgString: any, color: any, pathIdname: any) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

      
          const pathId = pathIdname; // assume path ID is the same as the gene key
          
          const pathElements = svgDoc.querySelectorAll(`.${pathId}`);
          if (pathElements) {
            pathElements.forEach((pathElement, index) => {
              const rgb = [color.r, color.g, color.b].map((val) => val.toString(16).padStart(2, '0')).join('');
              pathElement.setAttribute('fill', `#${rgb}`);
            })
        }
  
        const  svcontent = new XMLSerializer().serializeToString(svgDoc.documentElement)
      
        return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svcontent )))}`;
      };

    useEffect(() => {

        const fetchSkins = async () => {
          await get_all_kofias();
        };
         
        fetchSkins();
  
      },[connection])
  
    
  return (
    <>
    
    <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">

            <h5 className='text-green-400'> Kofias On Marketplace </h5>
            {kofiasOnMarketPlace ? (
                    <>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {kofiasOnMarketPlace.map((kofia: any, index: any ) => (
                        <div key={index} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            <img
                            alt={kofia.imageAlt}
                            src={`${kofia.svg}`}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            {/* <div>
                            <h3 className="text-sm text-gray-700">
                                <span aria-hidden="true" className="absolute inset-0" />
                                Created: <span className='text-orange-800'>{new Date(runaway.created_at.toString() * 1000).toLocaleString()}</span>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">experience: <span className='text-cyan-400'>{runaway.experience.toString()}</span></p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{runaway.price}</p> */}
                      <p className="text-sm font-medium text-gray-900 py-2"><span className='text-slate-500'>{feltToString(kofia.price)}</span> ETH</p>

                        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => buy_runaway()}>
                                    Buy
                        </button>

                        </div>
                        
                        </div>
                    ))}
                </div>
                    </>
                                ) : (

                                <p> No Kofia for runaway</p>
                )}

                

            </div>
    
    </>
  )
}

export default KofiaMarketPlace