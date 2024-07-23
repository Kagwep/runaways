use starknet::ContractAddress;
use core::array::ArrayTrait;

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
    pub runaway_id: u256,
    pub runaway_token_id: u256,
    pub genes: RunawayGenes,
    pub created_at: u64,   
    pub experience: u64,
    pub nr_children: u16, 
    pub tb_owner: ContractAddress,
    pub user: ContractAddress,
    pub metadata_updated: bool   
}


#[starknet::interface]
pub trait IRunawayContract<TContractState> {
    fn create_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256, owner: ContractAddress) -> (u256, Runaway);
    fn create_offspring_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256, runaway_id: u256,owner: ContractAddress) -> (u256, Runaway);
    fn update_runaway( ref self:TContractState,runaway_id: u256, experience:u64) -> Runaway;
    fn get_runaway(self: @TContractState, runaway_id: u256) -> Runaway;
    fn generate_color(ref self:TContractState, seed: u64) -> Color;
    fn generate_colors(
        ref self: TContractState
    ) -> (Color, Color, Color, Color);
    fn mix_colors(ref self :TContractState,color1: Color, color2: Color) -> Color;
    fn get_user_runaways(self :@TContractState,user: ContractAddress) -> Array<Runaway>;
    fn set_runaway_ownership_contract(ref self: TContractState, runaway_ownership_contract: ContractAddress);
    fn update_runaway_ownership(ref self:TContractState,runaway_id:u256, new_tb_owner:ContractAddress,new_user: ContractAddress);
    fn update_runaway_ownership_sale(ref self:TContractState,runaway_id:u256,new_user: ContractAddress);
    fn approve_update_of_metadata(ref self:TContractState,runaway_id:u256);
}


#[starknet::contract]
pub mod RunawayContract {

    use core::array::ArrayTrait;
    use starknet::{
            ContractAddress, contract_address_const, get_block_number, get_caller_address,
            get_contract_address, get_block_timestamp
        };

    use core::num::traits::Zero;


    use super::{Color,RunawayGenes,Runaway,IRunawayContract};

    const LCG_MULTIPLIER: u64 = 1103515245;
    const LCG_INCREMENT: u64 = 12345;
    const LCG_MODULUS: u64 = 0x100000000; // 2^32

    #[storage]
    pub struct Storage {
        pub owner: ContractAddress,
        pub runaways: LegacyMap<u256, Runaway>,
        pub next_runaway_id: u256,
        pub last_request: u64,
        pub last_request_id: u64,
        pub user_runaway: LegacyMap<ContractAddress, bool>,
        pub runaway_ownership_contract: ContractAddress,

    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {

    }

    #[constructor]
    fn constructor(ref self: ContractState, owner:ContractAddress) {
        self.next_runaway_id.write(1);
        self.owner.write(owner);
    }
    
    
    #[abi(embed_v0)]
    impl RunawayImpl of super::IRunawayContract<ContractState> {


        fn create_runaway( ref self:ContractState,caller: ContractAddress,runaway_token_id:u256, owner: ContractAddress) -> (u256, Runaway){

            let contract_caller = get_caller_address();

            assert( contract_caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let request_time = get_block_timestamp();
            let request_time_difference = request_time - self.last_request.read();

            assert(
                request_time_difference >= 60,
                'Runaway creation Underway'
            );

            assert(!self.user_runaway.read(caller), 'Already created a runaway');

            let runaway_id = self.next_runaway_id.read();

            let (body_color,eye_color,mouth_color,comb_color ) = self.generate_colors();

            let new_runaway_genes = RunawayGenes{
                body_color,
                eye_color,
                mouth_color,
                comb_color
            };

            let new_runaway = Runaway { runaway_id: runaway_id,runaway_token_id: runaway_token_id, genes: new_runaway_genes, created_at: get_block_timestamp(), experience:0, nr_children:0,tb_owner: owner, user: caller, metadata_updated: false};

            self.runaways.write(runaway_id, new_runaway);

            self.user_runaway.write(caller, true);

            self.next_runaway_id.write(runaway_id + 1);

            (runaway_id,new_runaway)


        }

        fn create_offspring_runaway( ref self:ContractState,caller: ContractAddress, runaway_token_id:u256, runaway_id: u256,owner: ContractAddress) -> (u256, Runaway){

            let contract_caller = get_caller_address();

            assert( contract_caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let request_time = get_block_timestamp();
            let request_time_difference = request_time - self.last_request.read();

            assert(
                request_time_difference >= 60,
                'Runaway creation Underway'
            );

            let mut parent_runaway = self.runaways.read(runaway_id);


            let (body_color,eye_color,mouth_color,comb_color ) = self.generate_colors();       

            let offspring_body_color = self.mix_colors(parent_runaway.genes.body_color, body_color);
            let offspring_eye_color = self.mix_colors(parent_runaway.genes.eye_color, eye_color);
            let offspring_mouth_color = self.mix_colors(parent_runaway.genes.mouth_color, mouth_color);
            let offspring_comb_color = self.mix_colors(parent_runaway.genes.comb_color, comb_color);
        

            let off_runaway_id = self.next_runaway_id.read();

            let new_runaway_genes = RunawayGenes{
                body_color:offspring_body_color,
                eye_color: offspring_eye_color,
                mouth_color: offspring_mouth_color,
                comb_color: offspring_comb_color,
            };

            let new_runaway = Runaway { runaway_id: off_runaway_id, runaway_token_id: runaway_token_id, genes: new_runaway_genes, created_at: get_block_timestamp(), experience:0, nr_children:0, tb_owner:owner, user: caller,metadata_updated: false};

            self.runaways.write(off_runaway_id, new_runaway);

            self.user_runaway.write(caller, true);

            self.next_runaway_id.write(off_runaway_id + 1);

            parent_runaway.nr_children += 1;
            parent_runaway.experience -= 100;

            self.runaways.write(runaway_id, parent_runaway);

            (off_runaway_id,new_runaway)

        }

        fn update_runaway( ref self:ContractState,runaway_id: u256, experience:u64) ->  Runaway{

            let contract_caller = get_caller_address();

            assert( contract_caller == self.runaway_ownership_contract.read(), 'Not Runaway Ownership Contract');

            let mut runaway = self.runaways.read(runaway_id);

            runaway.experience += experience;

            self.runaways.write(runaway_id,runaway);

            runaway

        }

        fn get_runaway(self: @ContractState, runaway_id: u256) -> Runaway{
            self.runaways.read(runaway_id)

        }

        fn generate_colors(
            ref self: ContractState
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

        fn mix_colors(ref self :ContractState, color1: Color, color2: Color) -> Color {
            // Convert to u16 for calculations
            let r1: u16 = color1.r.into();
            let g1: u16 = color1.g.into();
            let b1: u16 = color1.b.into();
            
            let r2: u16 = color2.r.into();
            let g2: u16 = color2.g.into();
            let b2: u16 = color2.b.into();
        
            // Perform mixing calculations
            let r: u8 = ((r1 + r2) / 2).try_into().unwrap();
            let g: u8 = ((g1 + g2) / 2).try_into().unwrap();
            let b: u8 = ((b1 + b2) / 2).try_into().unwrap();
        
            Color { r, g, b }
        }

        fn get_user_runaways(self :@ContractState,user: ContractAddress) -> Array<Runaway>{

            let mut runaways = ArrayTrait::<Runaway>::new();

            let total_runaways = self.next_runaway_id.read() - 1;

            let mut count = 1;

            if total_runaways > 0 {
                loop {

                    if (count > total_runaways){
                        break;
                    }

                    let runaway  = self.runaways.read(count);

                    if runaway.user == user {

                        runaways.append(runaway);
                    }

                    count += 1;
                }
            }

            runaways

        }

        fn set_runaway_ownership_contract(ref self: ContractState, runaway_ownership_contract: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.owner.read(), 'Not Owner' );

            self.runaway_ownership_contract.write(runaway_ownership_contract);

        }

        fn update_runaway_ownership(ref self:ContractState,runaway_id:u256, new_tb_owner:ContractAddress,new_user: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(),'Not Runaway Ownership Contract');

            let mut runaway = self.runaways.read(runaway_id);

            runaway.tb_owner = new_tb_owner;

            runaway.user = new_user;

            self.runaways.write(runaway_id,runaway);

        }

        fn update_runaway_ownership_sale(ref self:ContractState,runaway_id:u256,new_user: ContractAddress){

            let caller = get_caller_address();

            assert(caller == self.runaway_ownership_contract.read(),'Not Runaway Ownership Contract');

            let mut runaway = self.runaways.read(runaway_id);

            runaway.tb_owner = Zero::zero();

            runaway.user = new_user;

            self.runaways.write(runaway_id,runaway);

        }

        fn approve_update_of_metadata(ref self:ContractState,runaway_id:u256){

            let caller = get_contract_address();

            let mut runaway = self.runaways.read(runaway_id);

            assert(caller == runaway.user, 'Not Runaway User');

            runaway.metadata_updated = true;

            self.runaways.write(runaway_id,runaway);

            

        }


    }

  


}
