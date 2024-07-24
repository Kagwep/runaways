import React,{ useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../../../providers/AppProvider';
import { TokenboundConnector, TokenBoundModal,useTokenBoundModal } from 'tokenbound-connector';
import { convertToStarknetAddress, limitChars } from '../../../config/utils';
import { Abi, Contract } from 'starknet';
import { runawayAbi, runawayContractAddress, runawayOwnershipABI, runawayOwnershipContractAddress, runawaySkinsAbi, runawaySkinsContract  } from '../../../config/config';
import { provider } from '../../../config/constants';
import { SiKinsta } from 'react-icons/si';
import RunawayPriceModal from './RunawayPriceModal';
import KofiaPriceModal from './KofiaPriceModal';
import JacketPriceModal from './JackePriceModal';
import PantsPriceModal from './PantsPriceModal';
import { Runaway } from '../Runaway/Runaway';

const RunawayInfo = () => {

    const { id } = useParams();

    const [playingRunaway, setPlayingRunaway] = useState<number>(0)
    const [runaway , setRunaway] = useState<any | null>(null)
    const [kofias, setKofias] = useState<any | null>(null)
    const [pants, setPants] = useState<any | null>(null)
    const [jackets, setJackets] = useState<any | null>(null)
    const [runawaytba, setRunawayTba] = useState('')
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const [presetValue, setPresetValue] = useState('');
    const [isModalOpenOne, setIsModalOpenOne] = useState(false);
    const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
    const [isModalOpenThree, setIsModalOpenThree] = useState(false);
    const [isModalOpenFour, setIsModalOpenFour] = useState(false);

      interface Outfit {
        "pants-two": string;
        "pants-one": string;
        "jacket-arm-right": string;
        "jacket-arm-left": string;
        "jacket": string;
        "hat": string;
        "comb": string;
        "face": string;
      }
    
      type OutfitItem = keyof Outfit;

 
        const [outfit, setOutfit] = useState<Outfit>({
          "pants-two": "",
          "pants-one": "",
          "jacket-arm-right": "",
          "jacket-arm-left": "",
          "jacket": "",
          "hat": "",
          "comb": "",
          "face": ""
        });



    const openModalOne = () => setIsModalOpenOne(true);
    const closeModalOne = () => setIsModalOpenOne(false);

    const openModalTwo = () => setIsModalOpenTwo(true);
    const closeModalTwo = () => setIsModalOpenTwo(false);

    const openModalThree = () => setIsModalOpenThree(true);
    const closeModalThree = () => setIsModalOpenThree(false);

    const openModalFour = () => setIsModalOpenFour(true);
    const closeModalFour = () => setIsModalOpenFour(false);
  
    const handleSubmit = async (price: any) => {
      console.log('Submitted price:', price);
      // Handle the submitted price here
     await add_runaway_token_to_runaway_marketplace(Number(runaway.runaway_id),price.toString())
    };

    const handleSubmitOne = async (price: any, id:number) => {
      console.log('Submitted price:', price,id);
      // Handle the submitted price here
    // await add_runaway_token_to_runaway_marketplace(Number(runaway.runaway_id),price.toString())
       //await add_jacket_skin_token_to_runaway_marketplace()
    };


    const handleSubmitTwo = async (price: any) => {
      console.log('Submitted price:', price);
      // Handle the submitted price here
     await add_runaway_token_to_runaway_marketplace(Number(runaway.runaway_id),price.toString())
    };


    const handleSubmitThree = async (price: any) => {
      console.log('Submitted price:', price);
      // Handle the submitted price here
     await add_runaway_token_to_runaway_marketplace(Number(runaway.runaway_id),price.toString())
    };



  
    const handleButtonClick = () => {
      setShowOptions(true);
    };
  
    const selectOption = async (option: string) => {
      console.log('Selected option:', option);

      if (option=="pants"){
        try{

          const new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);

          await new_runaway_ownership_contract.create_runaway_pants_skin(runaway.runaway_id);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }
      }else if(option == "jacket"){
        try{
          const new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);

          await new_runaway_ownership_contract.create_runaway_jacket_skin(runaway.runaway_id);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }
      }else if(option == "kofia"){
        try{
          const new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);

          await new_runaway_ownership_contract.create_runaway_kofia_skin(runaway.runaway_id);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }
      }

      setShowOptions(false);
    };
  
    const handleClickOutside = (event: { target: any; }) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
  

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

        const {
        isOpen,
        openModal,
        closeModal,
        value,
        selectedOption,
        handleChange,
        handleChangeInput,
        resetInputValues,
    } = useTokenBoundModal();

    const tokenbound = new TokenboundConnector({
        tokenboundAddress: value, 
        parentAccountId: selectedOption, 
    });

    const svgUrl: string = '/runaway.svg';
    console.log(svgUrl)

    const svgUrlPants: string = '/pants.svg';

    const svgUrlJackets: string = '/jacket.svg';

    const svgUrlKofia: string = '/kofia.svg';

    const get_user_runaway = async () => {

        const runaways_contract = new Contract(runawayAbi,runawayContractAddress,provider)

        const runaway = await runaways_contract.get_runaway(Number(id));
  
        console.log("runaways: ", runaway)
  
      
        const response = await fetch(svgUrl);
         const svg = await response.text();
  
         const modifiedSvg = changePathFillType(svg, runaway.genes);
         runaway.svg = modifiedSvg;

         await get_kofia_skins(runaway.runaway_id);
         await get_jackets_skins(runaway.runaway_id);
         await get_pants_skins(runaway.runaway_id)

         

        const to_send_color =  [runaway.genes.comb_color.r, runaway.genes.comb_color.g, runaway.genes.comb_color.b].map((val) => val.toString(16).padStart(2, '0')).join('')
        const to_send_color_body =  [runaway.genes.body_color.r, runaway.genes.body_color.g, runaway.genes.body_color.b].map((val) => val.toString(16).padStart(2, '0')).join('')

        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["comb"]: `#${to_send_color}`
        }));

        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["face"]: `#${to_send_color_body}`
        }));

  
        setRunaway(runaway);
        setPresetValue(runaway.tb_owner);
          
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

      const get_runaway_tba = async() => {
        let runaway_tba = await runaway_ownership_contract.get_runaway_tba(1);
        setRunawayTba(convertToStarknetAddress(runaway_tba))
        console.log("The tba",convertToStarknetAddress(runaway_tba))
      }

      //fn update_runaway_exaperience(ref self: TContractState,runaway_id:u256, experience: u64);

      const update_runaway_exaperience = async (runaway_id: number) => {
     
        try{

        const new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);

        console.log(tokenBoundAddress);

          await new_runaway_ownership_contract.update_runaway_exaperience(Number(runaway_id),500);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }

    }


    const create_runaway_offspring = async () => {
       // create_runaway_offspring_and_tba(ref self: ContractState, runaway_id: u256)
       try{
          await runaway_ownership_contract.create_runaway_offspring_and_tba(1);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }

    }

    //create_runaway_kofia_skin(ref self:TContractState, runaway_id: u256);

    //get_runaway_kofias(self: @TContractState, runaway_id: u256,owner: ContractAddress) -> Array<Kofia>;

    const get_kofia_skins = async(runaway_id: number) => {

        console.log("called ...")

    
        const new_runaway_skin_contract = new Contract(runawaySkinsAbi,runawaySkinsContract,provider).typedv2(runawaySkinsAbi as Abi);


        const kofia_skins = await new_runaway_skin_contract.get_runaway_kofias(1,tokenBoundAddress)

        console.log("fyhfdytwq",kofia_skins)

        const response = await fetch(svgUrlKofia);
        const svg = await response.text();

        const pathId = "kofia_color";

        kofia_skins.forEach((kofia_skin: any) => {
        
            const modifiedSvg = changeSkinPathFillType(svg, kofia_skin.color,pathId);
            kofia_skin.svg = modifiedSvg;
    
            console.log(".....",kofia_skin)
           
          });

        setKofias([...kofia_skins])

    }

    

    const get_jackets_skins = async(runaway_id: number) => {

        console.log("called ...")

        

        const new_runaway_skin_contract = new Contract(runawaySkinsAbi,runawaySkinsContract,provider).typedv2(runawaySkinsAbi as Abi);


        const jacket_skins = await new_runaway_skin_contract.get_runaway_jackets(1,tokenBoundAddress)

        console.log("fyhfdytwq",jacket_skins)

        const response = await fetch(svgUrlJackets);
        const svg = await response.text();

        const pathId = "jacket_color";

        jacket_skins.forEach((jacket_skin: any) => {
        
            const modifiedSvg = changeSkinPathFillType(svg, jacket_skin.color,pathId);
            jacket_skin.svg = modifiedSvg;
    
            console.log(".....",jacket_skin)
           
          });

        setJackets([...jacket_skins])

    }


    
    const get_pants_skins = async(runaway_id: number) => {

        console.log("called ...")

        const new_runaway_skin_contract = new Contract(runawaySkinsAbi,runawaySkinsContract,provider).typedv2(runawaySkinsAbi as Abi);


        const pants_skins = await new_runaway_skin_contract.get_runaway_pants(runaway_id,tokenBoundAddress)

        console.log("fyhfdytwq",pants_skins)

        const response = await fetch(svgUrlPants);
        const svg = await response.text();

        const pathId = "pants_color";


        pants_skins.forEach((pants_skin: any) => {
        
            const modifiedSvg = changeSkinPathFillType(svg, pants_skin.color, pathId);
            pants_skin.svg = modifiedSvg;
    
            console.log(".....",pants_skin)
           
          });

          setPants([...pants_skins]);

    }

    const updateSkin = (color: any, pathId: any) => {

      const lowercaseItem = pathId.toLowerCase();

      if (lowercaseItem.includes('kofia')) {
        const to_send_color =  [color.r, color.g, color.b].map((val) => val.toString(16).padStart(2, '0')).join('')
        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["hat"]: `#${to_send_color}`
        }));


      }
      
      if (lowercaseItem.includes('pants')) {
        const to_send_color =  [color.r, color.g, color.b].map((val) => val.toString(16).padStart(2, '0')).join('')

        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["pants-two"]: `#${to_send_color}`
        }));


        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["pants-one"]: `#${to_send_color}`
        }));


      }
      
      if (lowercaseItem.includes('jacket')) {
        const to_send_color =  [color.r, color.g, color.b].map((val) => val.toString(16).padStart(2, '0')).join('')

        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["jacket-arm-right"]: `#${to_send_color}`
        }));


        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["jacket-arm-left"]: `#${to_send_color}`
        }));

        setOutfit((prevOutfit) => ({
          ...prevOutfit,
          ["jacket"]: `#${to_send_color}`
        }));


      }

        const svgSource = runaway.svg

        let svgString;

        // Check if the input is a data URL
        if (svgSource.startsWith('data:image/svg+xml;base64,')) {
            // Extract the base64 part
            const base64 = svgSource.split(',')[1];
            // Decode base64 to string
            try {
            svgString = atob(base64.trim());
            } catch (error) {
            console.error('Failed to decode base64:', error);
            return svgSource; // Return original source if decoding fails
            }
        } else {
            // If it's not a data URL, assume it's already an SVG string
            svgString = svgSource;
        }

        // Parse SVG string to DOM
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

        // Find all paths with class 'pants_color'
        const pathElements = svgDoc.querySelectorAll(`.${pathId}`);

          // Modify the fill color of found elements
        pathElements.forEach((pathElement) => {
            const rgb = [color.r, color.g, color.b]
            .map((val) => val.toString(16).padStart(2, '0'))
            .join('');
            pathElement.setAttribute('fill', `#${rgb}`);
        });

        // Serialize the modified SVG back to a string
        const serializer = new XMLSerializer();
        const modifiedSvgString = serializer.serializeToString(svgDoc);

        // Re-encode to base64
        const modifiedSvgBase64 = btoa(unescape(encodeURIComponent(modifiedSvgString)));



        setRunaway((prevRunaway: any) => ({
            ...prevRunaway,
            svg: `data:image/svg+xml;base64,${modifiedSvgBase64}`
        }));

    }

    //fn add_runaway_token_to_runaway_marketplace(ref self:TContractState, runaway_id: u256, price: felt252);

      const add_runaway_token_to_runaway_marketplace = async(runaway_id:number, price: string) => {
        try{
          let new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);
          await new_runaway_ownership_contract.add_runaway_token_to_runaway_marketplace(runaway_id,price);
          console.log('done');
          await get_user_runaway();
          
        }catch(error){
          console.log(error);
        }
      }


      // fn add_kofia_skin_token_to_runaway_marketplace(ref self:TContractState,runaway_id: u256, kofia_id: u256, price: felt252);

      const add_kofia_skin_token_to_runaway_marketplace = async(runaway_id:number, kofia_id:number,price:string) => {
        try{
          let new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);
          await new_runaway_ownership_contract.add_kofia_skin_token_to_runaway_marketplace(runaway_id,kofia_id,price);
          console.log('done');

        }catch(error){
          console.log(error);
        }
      }

      const add_jacket_skin_token_to_runaway_marketplace = async(runaway_id:number, jacket_id:number,price:string) => {
        try{
          let new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);
          await new_runaway_ownership_contract.add_jacket_skin_token_to_runaway_marketplace(runaway_id,jacket_id,price);
          console.log('done');

        }catch(error){
          console.log(error);
        }
      }

      const add_pants_skin_token_to_runaway_marketplace = async(runaway_id:number, pants_id:number,price:string) => {
        try{
          let new_runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,tokenBoundAccount).typedv2(runawayOwnershipABI as Abi);
          await new_runaway_ownership_contract.add_pants_skin_token_to_runaway_marketplace(runaway_id,pants_id,price);
          console.log('done');

        }catch(error){
          console.log(error);
        }
      }

      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      useEffect(() => {

        const fetchRunaway = async () => {
          await get_user_runaway();
          await get_runaway_tba();
    
        };
  
        if(tokenBoundConnection ){
          closeModal()
          fetchRunaway()
        
        }
      },[tokenBoundConnection])
  
  
          

    function handleSetRunawayId(id: any): void {
        setPlayingRunaway(id)
    }

    function TokenBoundModalWrapper(props: any) {
      React.useEffect(() => {
        if (props.presetValue) {
          props.handleChangeInput({ target: { value: props.presetValue } });
        }
      }, [props.presetValue]);
    
      return <TokenBoundModal {...props} />;
    }

  return (
    <>

      {playingRunaway != 0 ? (

          <Runaway runaway_id={playingRunaway} outfit={outfit} />

      ):(
        <>
      <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
    {!tokenBoundConnection ? (
                        <button
                        type='button'
                        className="rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={openModal}
                        >
                         Tokenbound Connect
                        </button>
                        ) : (

                        <button
                        type='button'
                        className="rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={() => disconnectTokenbound(tokenbound)}>
                          <span className='text-blue-800'>{limitChars(tokenBoundAddress!,8,true)} </span>Tokenbound disonnect
                        </button>
                        )}

                        {isOpen && (
                            <TokenBoundModalWrapper
                            isOpen={isOpen}
                            closeModal={closeModal}
                            value={value}
                            selectedOption={selectedOption}
                            handleChange={handleChange}
                            handleChangeInput={handleChangeInput}
                            onConnect={() => connectTokenbound(tokenbound)}
                            defaultValue={presetValue}
                          />
                       )}

      </div>

        {
            runaway ? (
         
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                  
                  <div>
                    <p>{limitChars(runaway.tb_owner!,8,true)} </p>
                    <h6 className="">Created at: <span className='text-orange-800'>{new Date(runaway.created_at.toString() * 1000).toLocaleString()}</span> </h6>
                    <p className="mt-4 text-gray-500">
                      experience: <span className='text-cyan-400'>{runaway.experience.toString()}</span>
                    </p>

                    { tokenBoundConnection && runaway.experience > 200 ? 
                        (
                            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 my-2 border border-gray-400 rounded shadow" onClick={() => create_runaway_offspring()}>
                                 Create Offspring
                           </button>
                        ) : (
                                <p></p>
                        )
                    }

                <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
                      <button 
                        onClick={handleButtonClick}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 my-2 border border-gray-400 rounded shadow"
                      >
                        Create Clothing
                      </button>
                      {showOptions && (
                        <div ref={optionsRef} className="flex flex-col space-y-3 w-full max-w-xs">
                          <button 
                            onClick={() => selectOption('pants')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            Pants
                          </button>
                          <button 
                            onClick={() => selectOption('kofia')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            Kofia
                          </button>
                          <button 
                            onClick={() => selectOption('jacket')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            Jacket
                          </button>
                          <button 
                            onClick={() => setShowOptions(false)}
                            className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

          
                    <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded relative z-10"  onClick={() => handleSetRunawayId(runaway.runaway_id)}>
                          Play
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded relative z-10"  onClick={() => update_runaway_exaperience(runaway.runaway_id)}>
                          update experience
                    </button>
                             <div className="p-4">
                                <button
                                  onClick={openModalOne}
                                  className="bg-cyan-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded relative z-10"
                                >
                                  Add to Marketplace
                                </button>
                                <RunawayPriceModal
                                  isOpen={isModalOpenOne}
                                  onClose={closeModalOne}
                                  onSubmit={handleSubmit}
                                />
                              </div>
                    </dl>
                  </div>
                  <div className="">
                    <img
                      alt={runaway.imageAlt}
                      src={`${runaway.svg}`}
                      className="rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
             
            ): (
                <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8"> Loading </div>
            )
        }

          <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
            
            <hr />

            <h4 className=''> Runaway Skins</h4>

          </div>

         

          <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">

             <h5 className='text-green-400'> Pants </h5>
                {pants ? (
                        <>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {pants.map((pant: any, index: any ) => (
                            <div key={index} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                alt={pant.imageAlt}
                                src={`${pant.svg}`}
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
                                <button className="rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={()=> updateSkin(pant.color,"pants_color")}>
                                    use
                                </button>
                                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" >
                                 Add To Marketplace
                                </button>
  
                            </div>
                            
                            </div>
                        ))}
                    </div>
                        </>
                                    ) : (

                                    <p> No Pants for runaway</p>
                    )}

                    

            </div>

          <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">

             <h5 className='text-green-400'> Jackets </h5>
                {jackets ? (
                        <>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {jackets.map((jacket: any, index: any ) => (
                            <div key={index} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                alt={jacket.imageAlt}
                                src={`${jacket.svg}`}
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
                                <button className="rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={()=> updateSkin(jacket.color,"jacket_color")}>
                                    use
                                </button>
                                <div className="p-4">
                                <button
                                  onClick={openModalTwo}
                                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                >
                                  Add to Marketplace
                                </button>
                                <JacketPriceModal
                                  isOpen={isModalOpenTwo}
                                  onClose={closeModalTwo}
                                  onSubmit={handleSubmitOne}
                                  id={jacket.jacket_id}
                                />
                              </div>
                            </div>
                            
                            </div>
                        ))}
                    </div>
                        </>
                                    ) : (

                                    <p> No Jackets for runaway</p>
                    )}

                    

            </div>

            <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">

                <h5 className='text-green-400'> Kofia </h5>
                {kofias ? (
                        <>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {kofias.map((kofia: any, index: any ) => (
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
                              <button className="rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" onClick={()=> updateSkin(kofia.color,"kofia_color")}>
                                    use
                                </button>
                                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" >
                                 Add To Marketplace
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
      </div>
        
        </>
      )}


    
    </>
  )
}

export default RunawayInfo

