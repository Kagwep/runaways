import { connect, ConnectedStarknetWindowObject, disconnect } from 'starknetkit';
import contractJson from '../abi/contracts_HelloStarknet.contract_class.json';
import { WebWalletConnector } from "starknetkit/webwallet";
import { limitChars } from "../config/utils";
import Erc20Abi from "../abi/ERC20.json";
import tokensContract from "../abi/stark_tokens_StarkTokensContract.contract_class.json";
import runawayCOntract from "../abi/runaway_RunawayContract.contract_class.json";
import runawayOwnershipAbi from "../abi/runaway_ownership_abi.json";


//import pragma_abi from '../assets/pragmaabi.json'
import { Abi } from 'starknet'

// const PRIVATE_KEY = "0x819033027885bc1840b6d564b6e8f68c"
const ACCOUNT_ADDRESS = ""

// const CONTRACT_ADDRESS = "0x010a09eb11dd5cc68012039a1923209413a96eafdefd635ac406231627464328" // main contract address
const CONTRACT_ADDRESS = "0x059b09f4eaa6d49a4e4914060ea226ceb8b9ae0608d49d24d68789fef65bf4bd"
const CONTRACT_ABI: Abi = contractJson.abi;
const CONTRACT_TOKENS_ABI: Abi = tokensContract.abi;
const TOKEN_CONTRACT = "0x011ce019f9241b50713713cb4ae43032c5e72eab8af208976daa50d8baab0b83"
const ERC20_ABI = Erc20Abi;
const runawayAbi = runawayCOntract.abi;
const runawayOwnershipABI = runawayOwnershipAbi

const ERC20CONTRACT_ADDRESS= "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
const runawayContractAddress = "0x07b7b80071b759381bb0198a03b323062739d70089881e9b6189d34d870fc3a1"
const runawayOwnershipContractAddress = "0x04509b4430d6599c6b16a0ae7b0ed32498bba6d34a842d48871344fedec19053"
// Pragma configs


// export {contract, provider, account}
export { ACCOUNT_ADDRESS, CONTRACT_ADDRESS, CONTRACT_ABI, ERC20_ABI,ERC20CONTRACT_ADDRESS,TOKEN_CONTRACT,CONTRACT_TOKENS_ABI, runawayAbi, runawayContractAddress, runawayOwnershipABI, runawayOwnershipContractAddress}
