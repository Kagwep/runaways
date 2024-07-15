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
    pub runaway_token_id: u256,
    pub genes: RunawayGenes,
    pub created_at: u64,   
    pub weight: u64, 
    pub experience: u64,
    pub nr_children: u16,    
}


#[starknet::interface]
pub trait IRunawayContract<TContractState> {
    fn create_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256) -> (u256, Runaway);
    fn update_runaway( ref self:TContractState,runaway_id: u256, weight:u64, experience:u64) -> Runaway;
    fn get_runaway(self: @TContractState, runaway_id: u256) -> Runaway;
    fn generate_color(ref self:TContractState, seed: u64) -> Color;
    fn generate_colors(
        ref self: TContractState,
        caller_address: ContractAddress
    ) -> (Color, Color, Color, Color);
}


#[starknet::contract]
pub mod RunawayContract {

    use starknet::{
        ContractAddress, contract_address_const, get_block_number, get_caller_address,
        get_contract_address, get_block_timestamp
    };

    use super::{Color,RunawayGenes,Runaway,IRunawayContract};

    const LCG_MULTIPLIER: u64 = 1103515245;
    const LCG_INCREMENT: u64 = 12345;
    const LCG_MODULUS: u64 = 0x100000000; // 2^32

    #[storage]
    pub struct Storage {
        pub runaways: LegacyMap<u256, Runaway>,
        pub next_runaway_id: u256,
        pub last_request: u64,
        pub last_request_id: u64,
        pub user_runaway: LegacyMap<ContractAddress, bool>

    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {

    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_runaway_id.write(1);
    }
    
    
    #[abi(embed_v0)]
    impl RunawayImpl of super::IRunawayContract<ContractState> {


        fn create_runaway( ref self:ContractState,caller: ContractAddress,runaway_token_id:u256) -> (u256, Runaway){

            let request_time = get_block_timestamp();
            let request_time_difference = request_time - self.last_request.read();

            assert(
                request_time_difference >= 60,
                'Runaway creation Underway'
            );

            assert(!self.user_runaway.read(caller), 'Already created a runaway');

            let runaway_id = self.next_runaway_id.read();

            let (body_color,eye_color,mouth_color,comb_color ) = self.generate_colors(caller);

            let new_runaway_genes = RunawayGenes{
                body_color,
                eye_color,
                mouth_color,
                comb_color
            };

            let new_runaway = Runaway { runaway_token_id: runaway_token_id, genes: new_runaway_genes, created_at: get_block_timestamp(),weight:0, experience:0, nr_children:0};

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

        fn generate_colors(
            ref self: ContractState,
            caller_address: ContractAddress
        ) -> (Color, Color, Color, Color) {

            let timestamp: u64 = get_block_timestamp();
            
            let seed1: u64 = (timestamp.into()) % LCG_MODULUS;
            let seed2 = (seed1 * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;
            let seed3 = (seed2 * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;
            let seed4 = (seed3 * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;

            (
                self.generate_color(seed1),
                self.generate_color(seed2),
                self.generate_color(seed3),
                self.generate_color(seed4)
            )
        }

        fn generate_color(ref self :ContractState, seed: u64) -> Color {
            let r: u8 = (seed % 256).try_into().unwrap();
            let g: u8 = ((seed / 256) % 256).try_into().unwrap();
            let b: u8 = ((seed / 65536) % 256).try_into().unwrap();
            Color { r, g, b }
        }


    }

  


}
