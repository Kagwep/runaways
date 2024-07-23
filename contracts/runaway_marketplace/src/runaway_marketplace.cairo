use starknet::ContractAddress;
use core::array::ArrayTrait;

use runaway_marketplace::runaway_customs::{Runaway,Kofia,Jacket,Pants, PantsMarketplace, KofiaMarketplace, JacketMarketplace, RunawayMarketplace};

#[starknet::interface]
pub trait IRunawayMarketplaceContract<TContractState> {
    
    fn set_runaway_ownership_contract(ref self: TContractState, runaway_ownership_contract: ContractAddress);
    fn set_runaway_contract(ref self: TContractState, runaway_contract: ContractAddress);
    fn set_skins_contract(ref self: TContractState, skins_contract: ContractAddress);
    fn add_runaway_token_to_marketplace(ref self: TContractState,  runaway_id: u256, price: felt252, nft_contract: ContractAddress);
    fn add_kofia_skin_token_to_marketplace(ref self:TContractState, kofia_id: u256, price: felt252, nft_contract: ContractAddress);
    fn add_jacket_skin_token_to_marketplace(ref self:TContractState, jacket_id: u256, price: felt252, nft_contract: ContractAddress);
    fn add_pants_skin_token_to_marketplace(ref self:TContractState, pants_id: u256, price: felt252, nft_contract: ContractAddress);
    fn get_all_runaways(self: @TContractState) -> Array<RunawayMarketplace>;
    fn get_all_kofias(self: @TContractState) -> Array<KofiaMarketplace>;
    fn get_all_jackets(self: @TContractState) -> Array<JacketMarketplace>;
    fn get_all_pants(self: @TContractState) -> Array<PantsMarketplace>;
    fn get_kofia(self: @TContractState, kofia_marketplace_id: u256) -> KofiaMarketplace;
    fn get_jackets(self: @TContractState, jacket_marketplace_id: u256) -> JacketMarketplace;
    fn get_runaways(self: @TContractState, runaway_marketplace_id: u256) -> RunawayMarketplace;
    fn get_pants(self: @TContractState, pants_marketplace_id: u256) -> PantsMarketplace;
    
}

#[starknet::contract]
pub mod RunawayMarketplaceContract {

    use starknet::{
        ContractAddress, contract_address_const, get_block_number, get_caller_address,
        get_contract_address, get_block_timestamp
    };

    use core::array::ArrayTrait;

    use runaway_marketplace::runaway_customs::{Runaway,Kofia,Jacket,Pants, PantsMarketplace, KofiaMarketplace, JacketMarketplace, RunawayMarketplace};

    use runaway_marketplace::interfaces::IRunawayOwnershipContract::{IRunawayOwnershipContractDispatcher, IRunawayOwnershipContractDispatcherTrait};
    use runaway_marketplace::interfaces::IRunawayContract::{IRunawayContractDispatcher, IRunawayContractDispatcherTrait};
    use runaway_marketplace::interfaces::ISkinContract::{ISkinContractDispatcher, ISkinContractDispatcherTrait};

    #[storage]
    struct Storage {
        owner:ContractAddress,
        runaways: LegacyMap<u256, RunawayMarketplace>,
        kofias: LegacyMap<u256, KofiaMarketplace>,
        jackets: LegacyMap<u256, JacketMarketplace>,
        pants: LegacyMap<u256, PantsMarketplace>,
        runaway_ownership_contract: ContractAddress,
        runaway_contract: ContractAddress,
        skins_contract: ContractAddress,
        next_runaway_marketplace_id : u256,
        next_kofia_marketplace_id : u256,
        next_jacket_marketplace_id : u256,
        next_pants_marketplace_id : u256,
    }



    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {

    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.next_runaway_marketplace_id.write(1);
        self.next_kofia_marketplace_id.write(1);
        self.next_jacket_marketplace_id.write(1);
        self.next_pants_marketplace_id.write(1);
    }

    #[abi(embed_v0)]
    impl RunawayMarketplaceContract of super::IRunawayMarketplaceContract<ContractState> {
        
        fn set_runaway_ownership_contract(ref self: ContractState, runaway_ownership_contract: ContractAddress){

             let caller = get_caller_address();

             assert(caller == self.owner.read(), 'Not Owner');

             self.runaway_ownership_contract.write(runaway_ownership_contract);

        }

        fn set_runaway_contract(ref self: ContractState, runaway_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.owner.read(), 'Not Owner');

            self.runaway_contract.write(runaway_contract);   
        }

        fn set_skins_contract(ref self: ContractState, skins_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.owner.read(), 'Not Owner');

            self.skins_contract.write(skins_contract); 
        }

        fn add_runaway_token_to_marketplace(ref self: ContractState,  runaway_id: u256, price: felt252, nft_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let marketplace_id = self.next_runaway_marketplace_id.read();

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract.read()
            };

            let runaway = runaway_dispacher.get_runaway(runaway_id);

            let runaway__tokens_marketplace = RunawayMarketplace {
                runaway_marketplace_id: marketplace_id,
                runaway: runaway,
                price: price,
                nft_contract_address: nft_contract
            };

            self.runaways.write(marketplace_id, runaway__tokens_marketplace);

            self.next_runaway_marketplace_id.write(marketplace_id + 1)
        }

        fn add_kofia_skin_token_to_marketplace(ref self:ContractState, kofia_id: u256, price: felt252, nft_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let marketplace_id = self.next_kofia_marketplace_id.read();

            let kofia_dispacher = ISkinContractDispatcher {
                contract_address: self.skins_contract.read()
            };

            let kofia = kofia_dispacher.get_kofia(kofia_id);

            let kofia_marketplace = KofiaMarketplace {
                kofia_marketplace_id: marketplace_id,
                kofia:kofia,
                price: price,
                nft_contract_address:nft_contract
            };

            self.kofias.write(marketplace_id, kofia_marketplace);

            self.next_kofia_marketplace_id.write(marketplace_id + 1)

        }

        fn add_jacket_skin_token_to_marketplace(ref self:ContractState, jacket_id: u256, price: felt252, nft_contract: ContractAddress){
            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let marketplace_id = self.next_jacket_marketplace_id.read();

            let jacket_dispacher = ISkinContractDispatcher {
                contract_address: self.skins_contract.read()
            };

            let jacket = jacket_dispacher.get_jacket(jacket_id);

            let jacket_marketplace = JacketMarketplace {
                jacket_marketplace_id: marketplace_id,
                jacket: jacket,
                price: price,
                nft_contract_address: nft_contract
            };

            self.jackets.write(marketplace_id, jacket_marketplace);

            self.next_jacket_marketplace_id.write(marketplace_id + 1)

        }

        fn add_pants_skin_token_to_marketplace(ref self:ContractState, pants_id: u256, price: felt252, nft_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let marketplace_id = self.next_pants_marketplace_id.read();

            let pants_dispacher = ISkinContractDispatcher {
                contract_address: self.skins_contract.read()
            };

            let pants = pants_dispacher.get_pant(pants_id);

            let pants_marketplace = PantsMarketplace {
                pants_marketplace_id: marketplace_id,
                pants : pants,
                price: price,
                nft_contract_address: nft_contract
            };

            self.pants.write(marketplace_id, pants_marketplace);

            self.next_pants_marketplace_id.write(marketplace_id + 1)

        }

        fn get_all_runaways(self: @ContractState) -> Array<RunawayMarketplace> {

            let mut result = ArrayTrait::<RunawayMarketplace>::new(); 

            let total_runaways = self.next_runaway_marketplace_id.read();

            let mut i: u256 = 1;

            loop {
                if i >= total_runaways {
                    break;
                }
                let runaway = self.runaways.read(i);
                result.append(runaway);
                i += 1;
            };

            result
        }

        fn get_all_kofias(self: @ContractState) -> Array<KofiaMarketplace> {
            let mut result = ArrayTrait::<KofiaMarketplace>::new();
            let total_kofias = self.next_kofia_marketplace_id.read();
            let mut i: u256 = 1;
            loop {
                if i >= total_kofias {
                    break;
                }
                let kofia = self.kofias.read(i);
                result.append(kofia);
                i += 1;
            };
            result
        }

        fn get_all_jackets(self: @ContractState) -> Array<JacketMarketplace> {

            let mut result = ArrayTrait::<JacketMarketplace>::new();
            let total_jackets = self.next_jacket_marketplace_id.read();

            let mut i: u256 = 1;

            loop {
                if i >= total_jackets {
                    break;
                }
                let jacket = self.jackets.read(i);
                result.append(jacket);
                i += 1;
            };

            result

        }

        fn get_all_pants(self: @ContractState) -> Array<PantsMarketplace> {
            let mut result = ArrayTrait::<PantsMarketplace>::new();
            let total_pants = self.next_pants_marketplace_id.read();
            let mut i: u256 = 1;
            loop {
                if i >= total_pants {
                    break;
                }
                let pants = self.pants.read(i);
                result.append(pants);
                i += 1;
            };
            result
        }

        fn get_kofia(self: @ContractState, kofia_marketplace_id: u256) -> KofiaMarketplace{
                self.kofias.read(kofia_marketplace_id)
        }
        fn get_jackets(self: @ContractState, jacket_marketplace_id: u256) -> JacketMarketplace{
                self.jackets.read(jacket_marketplace_id)
        }
        fn get_runaways(self: @ContractState, runaway_marketplace_id: u256) -> RunawayMarketplace{
                self.runaways.read(runaway_marketplace_id)
        }
        fn get_pants(self: @ContractState, pants_marketplace_id: u256) -> PantsMarketplace{
                 self.pants.read(pants_marketplace_id)

        }



    }
}
