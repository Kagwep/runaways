import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/home/Home";
import CTA from "./components/layout/CTA";
import Footer from "./components/layout/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Agents from "./components/pages/Agents";
import Agent from "./components/pages/Agent";
import Maps from "./components/pages/Maps";
import { useState,useEffect } from "react";
import { useAppContext } from "./providers/AppProvider";
import { Status } from "./helpers/status";
import { constants, Signature } from "starknet";
import { OffChainSession } from "@argent/x-sessions";
import { parseInputAmountToUint256 } from "./helpers/token";
import MarketplacePage from './components/pages/MarketplacePage';
import { RunAwaysManage } from "./components/pages/RunAwaysManage";


const App = () => {

  const [balance,setBalance] = useState(0)
  const { address, connection, connectWallet, contract,disconnectWallet,chainId,account,erc20_contract,tokens_contract} = useAppContext()
  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<Status>("idle");
  const [transactionError, setTransactionError] = useState("");
  const [accountSessionSignature, setAccountSessionSignature] = useState<string[] | Signature>();
  const [sessionRequest, setSessionRequest] = useState<OffChainSession>();


  console.log(chainId)

  console.log(accountSessionSignature)

 



  const getBalance = async() => {

     try{

      
        let balance= await contract.get_balance();
        console.log("hgefygefgfw",balance)
        setBalance(balance);

     } catch(error){
        console.log("oops!",error)
     }
        
  }

  const addBalance = async () => {
  

    const save_amount_int = "10"; // Convert to integer
 
    try{
      await contract.increase_balance(save_amount_int);
      console.log('done');
    }catch(error){
      console.log(error);
    }

  };

  const depositTokens = async() =>{


    const zuri = "0x011ce019f9241b50713713cb4ae43032c5e72eab8af208976daa50d8baab0b83"

    // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
    // check .populate

    const amount = "0.0001"
    const amountToU256 = parseInputAmountToUint256(amount);

    console.log(Number(amountToU256))

      try{
        await tokens_contract.deposit_fee(zuri,amountToU256);
        console.log('done');
      }catch(error){
        console.log(error);
      }

 
  }

  useEffect(() => {
    const fetchBalance = async () => {
      await getBalance();
    };
    
    fetchBalance();
  }, [contract]);

   console.log(balance)

  
  return (
    <BrowserRouter>
      <div className="w-full overflow-hidden">

        <Navbar />
        {/* <div>Chain: {chainId === constants.StarknetChainId.SN_SEPOLIA ? "SN_SEPOLIA" : "SN_MAIN"}</div>
        <button onClick={addBalance} className="text-blue-800"> Increase balance</button>
        <p>{balance.toString()}</p>
        <button onClick={getBalance} className="text-blue-800"> get balance</button>
        {connection && account && (
        <>
        <div className="d-flex">
           <button onClick={depositTokens} className="text-blue-800"> send tokens to contract </button>
        </div>
          
        </> */}
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route  path="/agents" element={<Agents />} />
          <Route path="/maps" element={<Maps />} />
          <Route
  
            path="/agent/:agentName"
            element={<Agent/>}
          />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/runaways" element={<RunAwaysManage />} />

        </Routes>
        <CTA />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
