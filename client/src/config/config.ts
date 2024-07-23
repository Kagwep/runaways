import { connect, ConnectedStarknetWindowObject, disconnect } from 'starknetkit';
import contractJson from '../abi/contracts_HelloStarknet.contract_class.json';
import { WebWalletConnector } from "starknetkit/webwallet";
import { limitChars } from "../config/utils";
import Erc20Abi from "../abi/ERC20.json";
import tokensContract from "../abi/stark_tokens_StarkTokensContract.contract_class.json";
import runawayCOntract from "../abi/runaway_RunawayContract.contract_class.json";
import runawayOwnershipAbi from "../abi/runaway_ownership_abi.json";
import runawaySkins from "../abi/runaway_skis_abi.json";
import runawayMarketplace from "../abi/runaway_marketplace.json";

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
const runawayAbi = runawayCOntract;
const runawayOwnershipABI = runawayOwnershipAbi
const runawaySkinsAbi = runawaySkins;
const runawayMarketPlaceAbi = runawayMarketplace;

const ERC20CONTRACT_ADDRESS= "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
const runawayContractAddress = "0x06056454c65b96099b9d7cfc6a58b1258d489009202feaab9a0d77a441cf2b9a"
const runawayOwnershipContractAddress = "0x030157df9492d547cda55dd3e8ccf11dedd829f9a9ed6710e001d25431c4985a"
const runawaySkinsContract = "0x0243c0908d2ea17c42fdc55a26487c215f67346745f43eac4525089395137128";
const runawayMarketplaceContractAddress = "0x057cdab510319829b92265c8b0660aa2719539faba1bcf6e66e76384f687aa5d"
// Pragma configs


// export {contract, provider, account}
export { 
    ACCOUNT_ADDRESS, CONTRACT_ADDRESS, CONTRACT_ABI, ERC20_ABI,ERC20CONTRACT_ADDRESS,
    TOKEN_CONTRACT,CONTRACT_TOKENS_ABI, runawayAbi, runawayContractAddress,
     runawayOwnershipABI, runawayOwnershipContractAddress, runawaySkinsAbi, runawaySkinsContract,
     runawayMarketplaceContractAddress,runawayMarketPlaceAbi
    
    }
