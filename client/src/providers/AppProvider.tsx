import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Contract,ProviderInterface,RpcProvider,constants } from 'starknet'
import { connect, ConnectedStarknetWindowObject, disconnect,Connector } from 'starknetkit'
import { 
    CONTRACT_ABI,
    CONTRACT_ADDRESS, 
    ERC20CONTRACT_ADDRESS, 
    ERC20_ABI, 
    TOKEN_CONTRACT,
    CONTRACT_TOKENS_ABI, 
    runawayAbi, 
    runawayContractAddress, 
    runawayOwnershipABI,
    runawayOwnershipContractAddress

} from '../config/config'
import { WebWalletConnector } from 'starknetkit/webwallet'
import { ARGENT_WEBWALLET_URL,provider } from '../config/constants'

import {
    TokenboundConnector, 
    TokenBoundModal, 
    useTokenBoundModal
  } from "tokenbound-connector"


const initialData = {
    contract: null as any,
    erc20_contract: null as any,
    tokens_contract: null as any,
    runaways_contract: null as any,
    runaway_ownership_contract: null as any,
    account: null as any,
    address: null as any,
    connection: null as any,
    chainId: null as any,
    connectWallet:null as any,
    isSmallScreen: false,
    disconnectWallet:null as any,
    connectTokenbound: null as any,
    disconnectTokenbound: null as any,
    tokenBoundConnection: null as any,
    tokenBoundAccount: null as any,
    tokenBoundAddress: null as any,

}

export const AppContext = createContext(initialData)

export const useAppContext = () => {
    return useContext(AppContext)
}

interface IAppProvider {
    children: ReactNode
}

const AppProvider = ({ children }: IAppProvider) => {

    let connectors: Connector[];

    const [contract, setContract] = useState<null | any>()
    const [erc20_contract, setERC20Contract] = useState<null | any>()
    const [tokens_contract, setTokenContract] = useState<null | any>()
    const [runaways_contract, setRunawaysContract] = useState<null | any>()
    const [account, setAccount] = useState<null | any>();
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | any>(false)
    const [connection, setConnection] = useState<ConnectedStarknetWindowObject | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [runaway_ownership_contract, setRunawayOwnershipContract] = useState<null | any>()
    const [tokenBoundConnection, setTokenBoundConnection] = useState<ConnectedStarknetWindowObject | null>(null);
    const [tokenBoundAccount, setTokenBoundAccount] = useState<null | any>(null);
    const [tokenBoundAddress, setTokenBoundAddress] = useState<null | any>(null);

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


    
    async function switchNetwork(connection: any) {
        if (connection && connection.chainId !== "SN_SEPOLIA") {
            try {
                if (window.starknet) {
                    console.log(connection.chainId)
                    await window.starknet.request({
                        type: "wallet_addStarknetChain",
                        params: {
                            chainId: "SN_SEPOLIA"
                        }
                    })
                }

            } catch (error) {
                
                console.log("Please manually switch your wallet network to testnet and reload the page");
            }
        }
    }

    const connectWallet = async() => {

       const res = connectors
      ? await connect({ connectors })
      : await connect({
          modalMode: "alwaysAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Argent | Portfolio",
            url: window.location.hostname,
            chainId: constants.NetworkName.SN_SEPOLIA,
            icons: [],
          },
        });

        const { wallet } = res;
       
        if(wallet && wallet.isConnected) {
          setConnection(wallet)
          setAccount(wallet.account);
          setAddress(wallet.selectedAddress)
          setChainId(wallet.chainId)

          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', wallet.selectedAddress);
          localStorage.setItem('walletChainId', wallet.chainId);

        }

        console.log(wallet?.chainId)
        
       }

       const connectTokenbound = async (tokenbound: { connect: () => any }) => {
           console.log("called tba connect: ", value)
            const connection = await tokenbound.connect();
            closeModal();
            resetInputValues();
        
            if (connection && connection.isConnected) {
            setTokenBoundConnection(connection);
            setTokenBoundAccount(connection.account);
            setTokenBoundAddress(connection.selectedAddress);
            console.log("connection ....", connection)
            }
       }

       const disconnectTokenbound = async (tokenbound: { disconnect: () => any }) => {
         await tokenbound.disconnect();
         setTokenBoundConnection(null);
         setTokenBoundAccount(null);
         setTokenBoundAddress('');
       }
    
       const disconnectWallet = async () => {
     
        await disconnect();
        
        setConnection(null);
        setAccount(null);
        setAddress('');

        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletChainId');

      }


    const makeContractConnection = () => {

            
       
            const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider)
            const erc20_contract = new Contract(ERC20_ABI, ERC20CONTRACT_ADDRESS, provider)
            const token_contract = new Contract(CONTRACT_TOKENS_ABI, TOKEN_CONTRACT, provider)
            const runaways_contract = new Contract(runawayAbi,runawayContractAddress,provider)
            const runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,provider)
            //setPragmaContract(pragma_contract)
            setERC20Contract(erc20_contract)
            setContract(contract)
            setTokenContract(token_contract)
            setRunawaysContract(runaways_contract)
            setRunawayOwnershipContract(runaway_ownership_contract)
 

            if (account){
                const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account)
                const erc20_contract = new Contract(ERC20_ABI, ERC20CONTRACT_ADDRESS, account)
                const token_contract = new Contract(CONTRACT_TOKENS_ABI, TOKEN_CONTRACT, account)
                const runaways_contract = new Contract(runawayAbi,runawayContractAddress,account)
                const runaway_ownership_contract = new Contract(runawayOwnershipABI,runawayOwnershipContractAddress,account)
                setERC20Contract(erc20_contract)
                setContract(contract)
                setTokenContract(token_contract)
                setRunawaysContract(runaways_contract)
                setRunawayOwnershipContract(runaway_ownership_contract)
                console.log(contract)
            }
        
    }



    const contextValue = useMemo(() => ({
        contract,
        erc20_contract,
        tokens_contract,
        runaways_contract,
        runaway_ownership_contract,
        account,
        address,
        connection,
        chainId,
        connectWallet,
        isSmallScreen,
        disconnectWallet,
        connectTokenbound,
        disconnectTokenbound,
        tokenBoundConnection,
        tokenBoundAccount,
        tokenBoundAddress,
    }), [account, contract, address, erc20_contract,chainId, tokenBoundAccount]);

    useEffect(() => {
        const reconnectWallet = async () => {
            const isConnected = localStorage.getItem('walletConnected');
            if (isConnected === 'true') {
              const storedAddress = localStorage.getItem('walletAddress');
              const storedChainId = localStorage.getItem('walletChainId');
        
              if (storedAddress && storedChainId) {
                try {
                  // Attempt to reconnect using stored information
                  const res = await connect({
                    modalMode: "neverAsk", // Prevents showing the modal on auto-reconnect
                    webWalletUrl: ARGENT_WEBWALLET_URL,
                    argentMobileOptions: {
                      dappName: "Argent | Portfolio",
                      url: window.location.hostname,
                      chainId: constants.NetworkName.SN_SEPOLIA,
                      icons: [],
                    },
                  });
        
                  const { wallet } = res;
        
                  if (wallet && wallet.isConnected && wallet.selectedAddress === storedAddress) {
                    setConnection(wallet);
                    setAccount(wallet.account);
                    setAddress(wallet.selectedAddress);
                    setChainId(wallet.chainId);
                    console.log('Reconnected successfully');
                  } else {
                    throw new Error('Reconnection failed or address mismatch');
                  }
                } catch (error) {
                  console.error('Failed to reconnect:', error);
                  // Clear stored data if reconnection fails
                  localStorage.removeItem('walletConnected');
                  localStorage.removeItem('walletAddress');
                  localStorage.removeItem('walletChainId');
                }
              }
            }
          };
        
          reconnectWallet();
       
        makeContractConnection()
        

    }, [connection]);

    // useEffect(() => {
    //     makeContractConnection()
    // }, [account, address])



    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider