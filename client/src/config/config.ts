import { connect, ConnectedStarknetWindowObject, disconnect } from 'starknetkit'
import contractJson from '../abi/contracts_HelloStarknet.contract_class.json'
import { WebWalletConnector } from "starknetkit/webwallet"
import { limitChars } from "../config/utils";


//import pragma_abi from '../assets/pragmaabi.json'
import { Abi } from 'starknet'

// const PRIVATE_KEY = "0x819033027885bc1840b6d564b6e8f68c"
const ACCOUNT_ADDRESS = ""

// const CONTRACT_ADDRESS = "0x010a09eb11dd5cc68012039a1923209413a96eafdefd635ac406231627464328" // main contract address
const CONTRACT_ADDRESS = "0x059b09f4eaa6d49a4e4914060ea226ceb8b9ae0608d49d24d68789fef65bf4bd"
const CONTRACT_ABI: Abi = contractJson.abi;
const ERC20_ABI = ''
// Pragma configs




// export {contract, provider, account}
export { ACCOUNT_ADDRESS, CONTRACT_ADDRESS, CONTRACT_ABI, ERC20_ABI}
