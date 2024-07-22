use starknet::ContractAddress;

#[starknet::interface]
trait IRunawayOwnershipContract<TContractState> {

    fn create_runaway_and_tba(ref self: TContractState);
    fn create_runaway_offspring_and_tba(ref self: TContractState, runaway_id: u256);
    fn set_runaway_contract_address(ref self: TContractState, runaway_contract_address: ContractAddress);
    fn set_runaway_factory_contract_adress(ref self: TContractState, runaway_factory_contract_adress: ContractAddress);
    fn set_runaway_tba_factory_contract_address(ref self: TContractState, runaway_tba_factory_contract_address: ContractAddress);
    fn set_runaway_skin_contract_address(ref self: TContractState, runaway_skin_contract_address: ContractAddress);
    fn set_runaway_marketplace_address(ref self: TContractState, runaway_marketplace_address: ContractAddress);
    fn create_runaway_kofia_skin(ref self:TContractState, runaway_id: u256);
    fn create_runaway_jacket_skin(ref self:TContractState, runaway_id: u256);
    fn create_runaway_pants_skin(ref self:TContractState, runaway_id: u256);
    fn add_runaway_token_to_runaway_marketplace(ref self:TContractState, runaway_id: u256, price: felt252);
    fn add_kofia_skin_token_to_runaway_marketplace(ref self:TContractState,runaway_id: u256, kofia_id: u256, price: felt252);
    fn add_jacket_skin_token_to_runaway_marketplace(ref self:TContractState,runaway_id: u256, jacket_id: u256, price: felt252);
    fn add_pants_skin_token_to_runaway_marketplace(ref self:TContractState,runaway_id: u256, pants_id: u256, price: felt252);
    fn get_runaway_tba(self: @TContractState, token_id: u256) -> ContractAddress;
    fn get_skin_tba(self: @TContractState, token_id: u256) -> ContractAddress;
    fn update_runaway_exaperience(ref self: TContractState,runaway_id:u256, experience: u64);
    fn acquire_runaway(ref self:TContractState,runaway_id:u256,runaway_marketplace_id: u256, amount: u256);
    fn bound_runaway(ref self:TContractState,runaway_id:u256);

}

#[starknet::contract]
mod RunawayOwnershipContract {

    use runaway_ownership::runaway_ownership::IRunawayOwnershipContract;
use core::option::OptionTrait;
    use core::traits::TryInto;
    use starknet::{
            ContractAddress, contract_address_const, get_block_number, get_caller_address,
            get_contract_address, get_block_timestamp
        };
    use starknet::class_hash::ClassHash;
    use core::num::traits::Zero;


    use runaway_ownership::interfaces::IRunawayContract::{IRunawayContractDispatcher,IRunawayContractDispatcherTrait};
    use runaway_ownership::interfaces::IRunAwayNFTFactory::{IRunAwayNFTFactoryDispatcher, IRunAwayNFTFactoryDispatcherTrait};
    use runaway_ownership::interfaces::IFactory::{IFactoryDispatcher, IFactoryDispatcherTrait};
    use runaway_ownership::interfaces::IERC721::{IERC721Dispatcher, IERC721DispatcherTrait};
    use runaway_ownership::interfaces::ISkinContract::{ISkinContractDispatcher, ISkinContractDispatcherTrait};
    use runaway_ownership::interfaces::IRunawayMarketplaceContract::{IRunawayMarketplaceContractDispatcher, IRunawayMarketplaceContractDispatcherTrait};

    use runaway_ownership::runaway_customs::{Runaway,Color,SkinType,Jacket,Kofia,Pants};

    const RUNAWAY_VALID_EXPERIENCE_FOR_OFFSPRING: u64 = 200;

    const ACCOUNT_CLASS_HASH: felt252 = 0x45d67b8590561c9b54e14dd309c9f38c4e2c554dd59414021f9d079811621bd;

    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait, ERC20ABILibraryDispatcher};
    use openzeppelin::access::ownable::OwnableComponent;
 

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        
        pub owner: ContractAddress,
        pub nft_class_hash: ClassHash,
        pub runaway_contract_address: ContractAddress,
        pub runaway_factory_contract_adress: ContractAddress,
        pub runaway_tba_factory_contract_address : ContractAddress,
        pub runaway_skin_contract_address: ContractAddress,
        pub user_runaway: LegacyMap<ContractAddress, bool>,
        pub runaways_tba: LegacyMap<u256,ContractAddress>,
        pub skin_tba: LegacyMap<u256,ContractAddress>,
        pub user_tokens: LegacyMap<(ContractAddress, u256), RunawayToken>,
        pub user_skin_tokens: LegacyMap<(ContractAddress, u256), RunawaySkinToken>,
        pub user_runaway_counts: LegacyMap<ContractAddress, u64>,
        pub runaway_marketplace_address: ContractAddress,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage


    }

    #[derive(Drop, starknet::Event, starknet::Store)]
    struct RunawayToken {
        nft_contract: ContractAddress,
        token_id: u256,
        runaway_id : u256
    }

    #[derive(Drop, starknet::Event, starknet::Store)]
    struct RunawaySkinToken {
        nft_contract: ContractAddress,
        token_id: u256,
        runaway_id : u256
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {


        fn call_deploy_skin(ref self: ContractState,skin_type: SkinType, runaway_id: u256, recipient:ContractAddress){
  
            let runaway_nft_token_dispacher = IRunAwayNFTFactoryDispatcher{
                contract_address: self.runaway_factory_contract_adress.read()
            };

            let new_runaway_token_skin_recipient = self.runaways_tba.read(runaway_id);

            let total_runaways = self.user_runaway_counts.read(new_runaway_token_skin_recipient);

            assert(total_runaways >= 3, 'Not enough runaways');

            let (deployed_address, token_id) = runaway_nft_token_dispacher.deploy_and_mint(new_runaway_token_skin_recipient);

            let runaway_skin_dispacher = ISkinContractDispatcher {
                contract_address: self.runaway_skin_contract_address.read()
            };

            runaway_skin_dispacher.create_skin(skin_type: skin_type, token_id: token_id, runaway_id: runaway_id,creator:new_runaway_token_skin_recipient);

            let runaway_skin_token = RunawaySkinToken {
                nft_contract: deployed_address,
                token_id: token_id,
                runaway_id : runaway_id
            };

            self.user_skin_tokens.write((recipient, token_id), runaway_skin_token);

            self.skin_tba.write(token_id, new_runaway_token_skin_recipient);
        }

        fn check_runaway_owner(ref self: ContractState,recipient:ContractAddress, runaway_id: u256){

            let runaway_dispatcher = IRunawayContractDispatcher{
                contract_address: self.runaway_contract_address.read()
            };

            let runaway =  runaway_dispatcher.get_runaway(runaway_id);

            assert(runaway.tb_owner > recipient, 'CALLER IS NOT OWNER');
        }
        
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        nft_class_hash: ClassHash,
        owner: ContractAddress,

    ) {
        self.nft_class_hash.write(nft_class_hash);
        self.owner.write(owner);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl RunawayOwnershipContract of super::IRunawayOwnershipContract<ContractState> {

        fn create_runaway_and_tba(ref self: ContractState){

            let initial_owner = get_contract_address();

            let recipient = get_caller_address();

            assert(!self.user_runaway.read(recipient), 'Already created a runaway');

            let new_salt = get_block_number();

            let runaway_nft_token_dispacher = IRunAwayNFTFactoryDispatcher{
                contract_address: self.runaway_factory_contract_adress.read()
            };

            let (deployed_address, token_id) = runaway_nft_token_dispacher.deploy_and_mint(initial_owner);

            let tba_factory_dispacher = IFactoryDispatcher {
                contract_address: self.runaway_tba_factory_contract_address.read()
            };

            let account_address = tba_factory_dispacher.create_account(
                nft_contract_address: deployed_address,
                nft_token_id: token_id,
                implementation_hash:ACCOUNT_CLASS_HASH,
                salt: new_salt.into(),
            );

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            let (_runaway_id, _runaway) = runaway_dispacher.create_runaway(recipient,token_id,account_address);


            self.runaways_tba.write(token_id, account_address);

            let nft_token_dispacher = IERC721Dispatcher{
                contract_address: deployed_address
            };

            nft_token_dispacher.transfer_from(initial_owner,recipient,token_id);

            self.user_runaway.write(recipient, true);

            self.user_runaway_counts.write(account_address, 1);


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

            let new_runaway_token_recipient = self.runaways_tba.read(runaway.runaway_token_id);

            let (deployed_address, token_id) = runaway_nft_token_dispacher.deploy_and_mint(new_runaway_token_recipient);

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            let (new_runaway_id, _runaway) = runaway_dispacher.create_offspring_runaway(recipient, token_id, runaway_id,new_runaway_token_recipient);

            let runaway_token = RunawayToken {
                nft_contract: deployed_address,
                token_id: token_id,
                runaway_id : new_runaway_id
            };

            self.user_tokens.write((new_runaway_token_recipient,token_id), runaway_token);

            let total_runaways = self.user_runaway_counts.read(new_runaway_token_recipient) + 1;

            self.user_runaway_counts.write(new_runaway_token_recipient, total_runaways);

            self.runaways_tba.write(token_id, new_runaway_token_recipient);

        }


        fn set_runaway_contract_address(ref self: ContractState, runaway_contract_address: ContractAddress){

            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not Owner');

            self.runaway_contract_address.write(runaway_contract_address);
        }

        fn set_runaway_factory_contract_adress(ref self: ContractState, runaway_factory_contract_adress: ContractAddress){

            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not Owner');

            self.runaway_factory_contract_adress.write(runaway_factory_contract_adress);
        }

        fn set_runaway_tba_factory_contract_address(ref self: ContractState, runaway_tba_factory_contract_address: ContractAddress){

            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not Owner');
            
            self.runaway_tba_factory_contract_address.write(runaway_tba_factory_contract_address);
        }

        fn set_runaway_skin_contract_address(ref self: ContractState, runaway_skin_contract_address: ContractAddress){

            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not Owner');

            self.runaway_skin_contract_address.write(runaway_skin_contract_address);
        }

        fn set_runaway_marketplace_address(ref self: ContractState, runaway_marketplace_address: ContractAddress) {

            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not Owner');

            self.runaway_marketplace_address.write(runaway_marketplace_address);
        }

        fn create_runaway_kofia_skin(ref self:ContractState, runaway_id: u256){

            let recipient = get_caller_address();

            self.check_runaway_owner(recipient:recipient, runaway_id: runaway_id);

            self.call_deploy_skin(skin_type: SkinType::Kofia, runaway_id: runaway_id, recipient: recipient);


        }

        fn create_runaway_pants_skin(ref self:ContractState, runaway_id: u256){

            let recipient = get_caller_address();

            self.check_runaway_owner(recipient:recipient, runaway_id: runaway_id);

            self.call_deploy_skin(skin_type: SkinType::Pants, runaway_id: runaway_id, recipient: recipient);


        }

        fn create_runaway_jacket_skin(ref self:ContractState, runaway_id: u256){

            let recipient = get_caller_address();

            self.check_runaway_owner(recipient:recipient, runaway_id: runaway_id);

            self.call_deploy_skin(skin_type: SkinType::Jacket, runaway_id: runaway_id, recipient: recipient);


        }

        fn add_runaway_token_to_runaway_marketplace(ref self:ContractState, runaway_id: u256, price: felt252){

            let caller = get_caller_address();
            
            self.check_runaway_owner(recipient: caller, runaway_id: runaway_id);

            let runaway_dispatcher = IRunawayContractDispatcher{
                contract_address: self.runaway_contract_address.read()
            };

            let runaway =  runaway_dispatcher.get_runaway(runaway_id);

            let nft_token = self.user_tokens.read((caller, runaway.runaway_token_id));

            let marketplace_dispacher = IRunawayMarketplaceContractDispatcher {
                contract_address: self.runaway_marketplace_address.read()
            };

            marketplace_dispacher.add_runaway_token_to_marketplace(runaway_id,price,nft_token.nft_contract);


        }

        fn add_kofia_skin_token_to_runaway_marketplace(ref self:ContractState,runaway_id: u256, kofia_id: u256, price: felt252){

            let caller = get_caller_address();
            
            self.check_runaway_owner(recipient: caller, runaway_id: runaway_id);

            let kofia_dispacher = ISkinContractDispatcher {
                contract_address: self.runaway_skin_contract_address.read()
            };

            let kofia = kofia_dispacher.get_kofia(kofia_id);

            assert(kofia.runaway_id == runaway_id, 'Not Runaway');

            let nft_token = self.user_skin_tokens.read((caller, kofia.token_id));

            let marketplace_dispacher = IRunawayMarketplaceContractDispatcher {
                contract_address: self.runaway_marketplace_address.read()
            };

            marketplace_dispacher.add_kofia_skin_token_to_marketplace(kofia_id,price,nft_token.nft_contract);

        }

        fn add_jacket_skin_token_to_runaway_marketplace(ref self:ContractState,runaway_id: u256, jacket_id: u256, price: felt252){

            let caller = get_caller_address();
            
            self.check_runaway_owner(recipient: caller, runaway_id: runaway_id);

            let jacket_dispacher = ISkinContractDispatcher {
                contract_address: self.runaway_skin_contract_address.read()
            };

            let jacket = jacket_dispacher.get_jacket(jacket_id);

            assert(jacket.runaway_id == runaway_id, 'Not Runaway');

            let nft_token = self.user_skin_tokens.read((caller, jacket.token_id));

            let marketplace_dispacher = IRunawayMarketplaceContractDispatcher {
                contract_address: self.runaway_marketplace_address.read()
            };

            marketplace_dispacher.add_jacket_skin_token_to_marketplace(jacket_id,price,nft_token.nft_contract);
        }

        fn add_pants_skin_token_to_runaway_marketplace(ref self:ContractState,runaway_id: u256, pants_id: u256, price: felt252){
            
            let caller = get_caller_address();
            
            self.check_runaway_owner(recipient: caller, runaway_id: runaway_id);

            let pants_dispacher = ISkinContractDispatcher {
                contract_address: self.runaway_skin_contract_address.read()
            };

            let pants = pants_dispacher.get_pant(pants_id);

            assert(pants.runaway_id == runaway_id, 'Not Runaway');

            let nft_token = self.user_skin_tokens.read((caller, pants.token_id));

            let marketplace_dispacher = IRunawayMarketplaceContractDispatcher {
                contract_address: self.runaway_marketplace_address.read()
            };

            marketplace_dispacher.add_pants_skin_token_to_marketplace(pants_id,price,nft_token.nft_contract);

        }

        fn update_runaway_exaperience(ref self: ContractState,runaway_id: u256, experience: u64){

            let caller = get_caller_address();

            let runaway_account = self.runaways_tba.read(runaway_id);

            assert(caller == runaway_account, 'Not Owner');

            let runaway_dispacher = IRunawayContractDispatcher {
                contract_address: self.runaway_contract_address.read()
            };

            runaway_dispacher.update_runaway(runaway_id, experience);

        }

        fn get_runaway_tba(self: @ContractState, token_id: u256) -> ContractAddress{
            self.runaways_tba.read(token_id)
        }
        fn get_skin_tba(self: @ContractState, token_id: u256) -> ContractAddress{
            self.skin_tba.read(token_id)
        }

        fn acquire_runaway(ref self:ContractState,runaway_id:u256, runaway_marketplace_id: u256,amount: u256){

                let buyer = get_caller_address();

                let runaway_tba = self.runaways_tba.read(runaway_id);

                let runaway_dispatcher = IRunawayContractDispatcher{
                    contract_address: self.runaway_contract_address.read()
                };

                let runaway =  runaway_dispatcher.get_runaway(runaway_id);

                assert(runaway.tb_owner == runaway_tba, 'Runaway Error');

                let marketplace_dispacher = IRunawayMarketplaceContractDispatcher{
                    contract_address: self.runaway_marketplace_address.read()
                };

                let runaway_marketplace_item = marketplace_dispacher.get_runaways(runaway_marketplace_id);

                let erc721_contract = runaway_marketplace_item.nft_contract_address;


                let erc721_dispacher = IERC721Dispatcher {
                    contract_address: erc721_contract
                };

                let owner = erc721_dispacher.owner_of(runaway.runaway_token_id);

                assert(owner == get_contract_address(), 'Runaway Not on sale');


                let eth_dispatcher = ERC20ABIDispatcher {
                    contract_address: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 // ETH Contract Address
                        .try_into()
                        .unwrap()
                };

                let has_paid = eth_dispatcher.transfer_from(buyer,runaway_tba,amount);

                assert(has_paid, 'Payment Failed');

                erc721_dispacher.transfer_from(buyer,runaway_tba,runaway.runaway_token_id);

                let user_token = RunawayToken {
                    nft_contract: Zero::zero(),
                    token_id: Zero::zero(),
                    runaway_id : Zero::zero()
                };

                let to_new_owner_token = self.user_tokens.read((runaway_tba,runaway.runaway_token_id));

                self.user_tokens.write((runaway.tb_owner,runaway.runaway_token_id),user_token);

                runaway_dispatcher.update_runaway_ownership_sale(runaway_id,buyer);

                self.user_tokens.write((buyer,runaway.runaway_token_id),to_new_owner_token);

        }

        fn bound_runaway(ref self:ContractState,runaway_id:u256){

            let caller = get_caller_address();

            let runaway_dispatcher = IRunawayContractDispatcher{
                contract_address: self.runaway_contract_address.read()
            };

            let runaway =  runaway_dispatcher.get_runaway(runaway_id);

            assert(runaway.tb_owner.is_zero(), 'Runaway already bounded');

            let user_token = self.user_tokens.read((caller,runaway.runaway_token_id));

            assert(!user_token.runaway_id.is_zero(),'Token invalid');


            let tba_factory_dispacher = IFactoryDispatcher {
                contract_address: self.runaway_tba_factory_contract_address.read()
            };

            let new_salt = get_block_number();

            let account_address = tba_factory_dispacher.create_account(
                nft_contract_address: user_token.nft_contract,
                nft_token_id: user_token.token_id,
                implementation_hash:ACCOUNT_CLASS_HASH,
                salt: new_salt.into(),
            );

            let user_token_updated = RunawayToken {
                nft_contract: Zero::zero(),
                token_id: Zero::zero(),
                runaway_id : Zero::zero()
            };

            self.user_tokens.write((caller,runaway.runaway_token_id), user_token_updated);

            self.user_tokens.write((account_address,runaway.runaway_token_id), user_token);

        }


    }
}

