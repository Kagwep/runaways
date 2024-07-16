#[starknet::interface]
trait IRunawayOwnershipContract<TContractState> {
    fn create_runaway_and_tba(ref self: TContractState);
    fn create_runaway_offspring_and_tba(ref self: TContractState, runaway_id: u256);
}

#[starknet::contract]
mod RunawayOwnershipContract {

    use core::option::OptionTrait;
    use core::traits::TryInto;
    use starknet::{
            ContractAddress, contract_address_const, get_block_number, get_caller_address,
            get_contract_address, get_block_timestamp
        };
    use starknet::class_hash::ClassHash;

    use runaway_ownership::interfaces::IRunawayContract::{IRunawayContractDispatcher,IRunawayContractDispatcherTrait};
    use runaway_ownership::interfaces::IRunAwayNFTFactory::{IRunAwayNFTFactoryDispatcher, IRunAwayNFTFactoryDispatcherTrait};
    use runaway_ownership::interfaces::IFactory::{IFactoryDispatcher, IFactoryDispatcherTrait};

    use runaway_ownership::runaway_customs::{Runaway,Color,SkinType,Jacket,Kofia,Pants};

    const RUNAWAY_VALID_EXPERIENCE_FOR_OFFSPRING: u64 = 200;

    #[storage]
    struct Storage {
        
        pub nft_class_hash: ClassHash,
        pub runaway_contract_address: ContractAddress,
        pub runaway_factory_contract_adress: ContractAddress,
        pub runaway_tba_factory_contract_address : ContractAddress,
        pub user_runaway: LegacyMap<ContractAddress, bool>,
        pub user_runaways: LegacyMap<(ContractAddress, u256), Runaway>,
        pub runaways_tba: LegacyMap<u256,ContractAddress>,
        pub user_tokens: LegacyMap<(ContractAddress, u256), RunawayToken>

    }

    #[derive(Drop, starknet::Event)]
    struct RunawayToken {
        nft_contract: ContractAddress,
        token_id: u256,
        runaway_id : u256
    }


    #[constructor]
    fn constructor(
        ref self: ContractState,
        nft_class_hash: ClassHash,
        runaway_contract_address: ContractAddress,
        runaway_factory_contract_adress: ContractAddress,
        runaway_tba_factory_contract_address: ContractAddress
    ) {
        self.nft_class_hash.write(nft_class_hash);
        self.runaway_contract_address.write(runaway_contract_address);
        self.runaway_factory_contract_adress.write(runaway_factory_contract_adress);
        self.runaway_tba_factory_contract_address.write(runaway_tba_factory_contract_address);
    }

    #[abi(embed_v0)]
    impl RunawayOwnershipContract of super::IRunawayOwnershipContract<ContractState> {

        fn create_runaway_and_tba(ref self: ContractState){

            let recipient = get_caller_address();

            assert(!self.user_runaway.read(recipient), 'Already created a runaway');

            let new_salt = get_block_number();

            let runaway_nft_token_dispacher = IRunAwayNFTFactoryDispatcher{
                contract_address: self.runaway_factory_contract_adress.read()
            };

            let (deployed_address, token_id) = runaway_nft_token_dispacher.deploy_and_mint(recipient);

            let tba_factory_dispacher = IFactoryDispatcher {
                contract_address: self.runaway_tba_factory_contract_address.read()
            };

            let c_implementation_hash: felt252 = self.nft_class_hash.read().try_into().unwrap();

            let account_address = tba_factory_dispacher.create_account(
                nft_contract_address: deployed_address,
                nft_token_id: token_id,
                implementation_hash:c_implementation_hash,
                salt: new_salt.into(),
            );

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            let (runaway_id, runaway) = runaway_dispacher.create_runaway(recipient,token_id);

            self.user_runaways.write((recipient, runaway_id),runaway);

            self.runaways_tba.write(runaway_id, account_address);

            let runaway_token = RunawayToken {
                nft_contract: deployed_address,
                token_id: token_id,
                runaway_id : runaway_id
            };

            self.user_tokens.write((recipient,token_id), runaway_token);

            self.user_runaway.write(recipient, true);

        }

        fn create_runaway_offspring_and_tba(ref self: ContractState, runaway_id: u256){

            let recipient = get_caller_address();

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            let runaway = runaway_dispacher.get_runaway(runaway_id);

            assert(runaway.experience >= RUNAWAY_VALID_EXPERIENCE_FOR_OFFSPRING, 'Experience not Enough');

            let runaway_nft_token_dispacher = IRunAwayNFTFactoryDispatcher{
                contract_address: self.runaway_factory_contract_adress.read()
            };

            let new_runaway_token_recipient = self.runaways_tba.read(runaway_id);

            let (deployed_address, token_id) = runaway_nft_token_dispacher.deploy_and_mint(new_runaway_token_recipient);

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            let (new_runaway_id, runaway) = runaway_dispacher.create_offspring_runaway(recipient, token_id, runaway_id);

            let runaway_token = RunawayToken {
                nft_contract: deployed_address,
                token_id: token_id,
                runaway_id : new_runaway_id
            };

            self.user_tokens.write((recipient,token_id), runaway_token);

            self.user_runaways.write((recipient, runaway_id),runaway);

        }


    }
}

