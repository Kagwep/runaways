import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Contract,ProviderInterface,RpcProvider,constants } from 'starknet'
import { connect, ConnectedStarknetWindowObject, disconnect,Connector } from 'starknetkit'
import { CONTRACT_ABI, CONTRACT_ADDRESS} from '../config/config'
import { WebWalletConnector } from 'starknetkit/webwallet'
import { ARGENT_WEBWALLET_URL,provider } from '../config/constants'
import { StarknetChainId } from "starknet-types";


const initialData = {
    contract: null as any,
    pragma_contract: null as any,
    account: null as any,
    address: null as any,
    connection: null as any,
    chainId: null as any,
    connectWallet:null as any,
    isSmallScreen: false,
    disconnectWallet:null as any,
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
    const [pragma_contract, setPragmaContract] = useState<null | any>()
    const [account, setAccount] = useState<null | any>();
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | any>(false)
    const [connection, setConnection] = useState<ConnectedStarknetWindowObject | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    

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

        }

        console.log(wallet?.chainId)
        
       }
    
       const disconnectWallet = async () => {
     
        await disconnect();
        
        setConnection(null);
        setAccount(null);
        setAddress('');
      }


    const makeContractConnection = () => {

            
       
            const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider)
            //const pragma_contract = new Contract(PRAGMA_ABI, PRAGMA_CONTRACT_ADDRESS, account)
            //setPragmaContract(pragma_contract)

            setContract(contract)
 

            if (account){
                const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account)
                //const pragma_contract = new Contract(PRAGMA_ABI, PRAGMA_CONTRACT_ADDRESS, account)
                //setPragmaContract(pragma_contract)
                setContract(contract)
                console.log(contract)
            }
        
    }



    const contextValue = useMemo(() => ({
        contract,
        pragma_contract,
        account,
        address,
        connection,
        chainId,
        connectWallet,
        isSmallScreen,
        disconnectWallet,
    }), [account, contract, address, pragma_contract,chainId]);

    useEffect(() => {
        const connectToStarknet = async () => {
            const { wallet } = await connect({
                webWalletUrl: "https://web.argent.xyz",
                connectors: [
                  new WebWalletConnector({
                    url: "https://web.argent.xyz",
                  }),
                ],
              })

            if (wallet && wallet.isConnected) {
                setConnection(connection);
                setAccount(wallet.account);
                setAddress(wallet.selectedAddress)
            }
            switchNetwork(connection)

        };
       
        makeContractConnection()
        
        connectToStarknet();
    }, [connection,account]);

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