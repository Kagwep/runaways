use starknet::ContractAddress;

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct RunawayGenes {
    pub body_color: Color,
    pub eye_color: Color,
    pub mouth_color: Color,
    pub comb_color: Color,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Runaway {
    pub genes: RunawayGenes,
    pub created_at: u64,   
    pub weight: u64, 
    pub experience: u64,
    pub nr_children: u16,    
}

#[starknet::interface]
pub trait IPragmaVRF<TContractState> {

    fn get_color(ref self: TContractState,random_word_one: felt252,random_word_two: felt252,random_word_three: felt252) -> Color;

    fn request_randomness_from_pragma(
        ref self: TContractState,
        seed: u64,
        callback_address: ContractAddress,
        callback_fee_limit: u128,
        publish_delay: u64,
        num_words: u64,
        calldata: Array<felt252>
    );
    fn receive_random_words(
        ref self: TContractState,
        requester_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>
    );

    fn withdraw_extra_fee_fund(ref self: TContractState, receiver: ContractAddress);
}

#[starknet::interface]
pub trait IRunawayContract<TContractState> {
    fn create_runaway( ref self:TContractState,caller: ContractAddress) -> (u256, Runaway);
    fn update_runaway( ref self:TContractState,runaway_id: u256, weight:u64, experience:u64) -> Runaway;
    fn get_runaway(self: @TContractState, runaway_id: u256) -> Runaway;
}


#[starknet::contract]
pub mod RunawayContract {

    use starknet::{
        ContractAddress, contract_address_const, get_block_number, get_caller_address,
        get_contract_address, get_block_timestamp
    };
    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};
    use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use super::{Color,RunawayGenes,Runaway,IRunawayContract};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;
    
    #[storage]
    pub struct Storage {
        pub pragma_vrf_contract_address: ContractAddress,
        pub runaways: LegacyMap<u256, Runaway>,
        pub next_runaway_id: u256,
        pub last_body_color: Color,
        pub last_eye_color: Color,
        pub last_mouth_color: Color,
        pub last_comb_color: Color,
        pub last_request: u64,
        pub min_block_number_storage: u64,
        pub last_request_id: u64,
        pub user_runaway: LegacyMap<ContractAddress, bool>,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, pragma_vrf_contract_address: ContractAddress, owner: ContractAddress) {
        self.next_runaway_id.write(1);
        self.ownable.initializer(owner);
        self.pragma_vrf_contract_address.write(pragma_vrf_contract_address);
    }
    
    
    #[abi(embed_v0)]
    impl RunawayImpl of super::IRunawayContract<ContractState> {


        fn create_runaway( ref self:ContractState,caller: ContractAddress) -> (u256, Runaway){

            let request_time = get_block_timestamp();
            let request_time_difference = request_time - self.last_request.read();

            assert(
                request_time_difference >= 60,
                'Runaway creation Underway'
            );

            assert(!self.user_runaway.read(caller), 'Already created a runaway');

            let runaway_id = self.next_runaway_id.read();

            let new_runaway_genes = RunawayGenes{
                body_color: self.last_body_color.read(),
                eye_color: self.last_eye_color.read(),
                mouth_color: self.last_mouth_color.read(),
                comb_color: self.last_comb_color.read()
            };

            let new_runaway = Runaway { genes: new_runaway_genes, created_at: get_block_timestamp(),weight:0, experience:0, nr_children:0};

            self.runaways.write(runaway_id, new_runaway);

            self.user_runaway.write(caller, true);

            self.next_runaway_id.write(runaway_id + 1);

            (runaway_id,new_runaway)


        }

        fn update_runaway( ref self:ContractState,runaway_id: u256, weight:u64, experience:u64) ->  Runaway{

            let mut runaway = self.runaways.read(runaway_id);

            runaway.weight += weight;
            runaway.experience += experience;

            self.runaways.write(runaway_id,runaway);

            runaway

        }


        fn get_runaway(self: @ContractState, runaway_id: u256) -> Runaway{
            self.runaways.read(runaway_id)

        }


    }

    #[abi(embed_v0)]
    impl PragmaVRFOracle of super::IPragmaVRF<ContractState> {

        fn request_randomness_from_pragma(
            ref self: ContractState,
            seed: u64,
            callback_address: ContractAddress,
            callback_fee_limit: u128,
            publish_delay: u64,
            num_words: u64,
            calldata: Array<felt252>
        ) {
           
            let randomness_contract_address = self.pragma_vrf_contract_address.read();
            let randomness_dispatcher = IRandomnessDispatcher {
                contract_address: randomness_contract_address
            };

           
            // Approve the randomness contract to transfer the callback fee
            // You would need to send some ETH to this contract first to cover the fees
            let eth_dispatcher = ERC20ABIDispatcher {
                contract_address: contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                >() // ETH Contract Address
            };
            eth_dispatcher
                .approve(
                    randomness_contract_address,
                    (callback_fee_limit + callback_fee_limit / 5).into()
                );

            // Request the randomness
            let request_id = randomness_dispatcher
                .request_random(
                    seed, callback_address, callback_fee_limit, publish_delay, num_words, calldata
                );

            let current_block_number = get_block_number();
            self.min_block_number_storage.write(current_block_number + publish_delay);

            let last_request = get_block_timestamp();

            self.last_request.write(last_request);
            self.last_request_id.write(request_id);

           
        }

        fn receive_random_words(
            ref self: ContractState,
            requester_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>
        ) {
            
            // Have to make sure that the caller is the Pragma Randomness Oracle contract
            let caller_address = get_caller_address();
            assert(
                caller_address == self.pragma_vrf_contract_address.read(),
                'caller not randomness contract'
            );
            // and that the current block is within publish_delay of the request block
            let current_block_number = get_block_number();
            let min_block_number = self.min_block_number_storage.read();
            assert(min_block_number <= current_block_number, 'block number issue');

            let last_body_color: Color = self.get_color(*random_words.at(0),*random_words.at(1),*random_words.at(2));
            let last_eye_color: Color =  self.get_color(*random_words.at(3),*random_words.at(4),*random_words.at(5));
            let last_mouth_color: Color = self.get_color(*random_words.at(6),*random_words.at(7),*random_words.at(8));
            let last_comb_color: Color = self.get_color(*random_words.at(9),*random_words.at(10),*random_words.at(11));

            self.last_body_color.write(last_body_color);
            self.last_eye_color.write(last_eye_color);
            self.last_mouth_color.write(last_mouth_color);
            self.last_comb_color.write(last_comb_color);
            
        }

        fn withdraw_extra_fee_fund(ref self: ContractState, receiver: ContractAddress) {
            self.ownable.assert_only_owner();
            let eth_dispatcher = ERC20ABIDispatcher {
                contract_address: contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                >() // ETH Contract Address            
            };
            let balance = eth_dispatcher.balance_of(get_contract_address());
            eth_dispatcher.transfer(receiver, balance);
        }

        fn get_color(ref self:ContractState, random_word_one: felt252,random_word_two: felt252,random_word_three: felt252) -> Color{

            let random_u256: u256 = random_word_one.into();
            let random_0_to_255 = random_u256 % 256;
            let new_random_0_to_255: u8 = random_0_to_255.try_into().unwrap();

            let random_u256: u256 = random_word_two.into();
            let random_1_to_255 = random_u256 % 256;
            let new_random_1_to_255: u8 = random_1_to_255.try_into().unwrap();

            let random_u256: u256 = random_word_three.into();
            let random_3_to_255 = random_u256 % 256;
            let new_random_3_to_255: u8 = random_3_to_255.try_into().unwrap();
    
    
            Color {r:new_random_0_to_255, g:new_random_1_to_255, b:new_random_3_to_255}
    
            }

        
    }


}
