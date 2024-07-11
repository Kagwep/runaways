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
import { SessionKeysExecute } from "./sessions/SessionKeysExecute";
import { SessionKeysSign } from "./sessions/SessionKeysSign";
import { SessionKeysExecuteOutside } from "./sessions/SessionKeysExecuteOutside";
import { SessionKeysTypedDataOutside } from "./sessions/SessionKeysTypedDataOutside";


const App = () => {

  const [balance,setBalance] = useState(0)
  const { address, connection, connectWallet, contract,disconnectWallet,chainId,account} = useAppContext()
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
        <div>Chain: {chainId === constants.StarknetChainId.SN_SEPOLIA ? "SN_SEPOLIA" : "SN_MAIN"}</div>
        <button onClick={addBalance} className="text-blue-800"> Increase balance</button>
        <p>{balance.toString()}</p>
        <button onClick={getBalance} className="text-blue-800"> get balance</button>
        {connection && account && (
        <>
          <div
            className={`${lastTransactionHash ? "cursor-pointer hover:underline" : "default"}`}
            onClick={() => {
              if (!lastTransactionHash) return;
              window.open(`https://sepolia.starkscan.co/tx/${lastTransactionHash}`, "_blank");
            }}
          >
            Last tx hash: {lastTransactionHash || "---"}
          </div>
          <div>Tx status: {transactionStatus}</div>
          <div color="##ff4848">{transactionError.toString()}</div>

          <div className="flex flex-col text-black">
            <SessionKeysSign
              wallet={connection}
              setTransactionStatus={setTransactionStatus}
              setAccountSessionSignature={setAccountSessionSignature}
              setSessionRequest={setSessionRequest}
            />
          </div>

          <div className="flex flex-col text-black">
            <SessionKeysExecute
              address={address}
              accountSessionSignature={accountSessionSignature}
              sessionRequest={sessionRequest}
              setTransactionStatus={setTransactionStatus}
              setLastTransactionHash={setLastTransactionHash}
              transactionStatus={transactionStatus}
            />
          </div>

          <div className="flex text-black justify-between">
            <div className="flex flex-col text-black ">
              <SessionKeysExecuteOutside
                address={address}
                accountSessionSignature={accountSessionSignature}
                sessionRequest={sessionRequest}
                transactionStatus={transactionStatus}
              />
            </div>
            <div className="flex flex-col text-black ">
              <SessionKeysTypedDataOutside
                address={address}
                accountSessionSignature={accountSessionSignature}
                sessionRequest={sessionRequest}
                transactionStatus={transactionStatus}
              />
            </div>
          </div>
        </>
      )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route  path="/agents" element={<Agents />} />
          <Route path="/maps" element={<Maps />} />
          <Route
  
            path="/agent/:agentName"
            element={<Agent/>}
          />
        </Routes>
        <CTA />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
