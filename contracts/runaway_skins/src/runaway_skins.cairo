use starknet::ContractAddress;

use core::array::ArrayTrait;

#[derive(Drop, Serde, Copy, starknet::Store)]
enum SkinType {
    Kofia,
    Jacket,
    Pants,
}


#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
struct Kofia {
    color: Color,
    runaway_id: u256,
    token_id: u256,
    tba_owner: ContractAddress,
    user: ContractAddress,
    metadata_updated: bool
}

#[derive(Drop, Serde, Copy, starknet::Store)]
struct Jacket {
    color: Color,
    runaway_id: u256,
    token_id: u256,
    tba_owner: ContractAddress,
    user: ContractAddress,
    metadata_updated: bool
}

#[derive(Drop, Serde, Copy, starknet::Store)]
struct Pants {
    color: Color,
    runaway_id: u256,
    token_id: u256,
    tba_owner: ContractAddress,
    user: ContractAddress,
    metadata_updated: bool
}


#[starknet::interface]
pub trait ISkinContract<TContractState> {
    fn create_skin(
        ref self: TContractState,
        skin_type: SkinType,
        token_id: u256,
        runaway_id: u256,
        creator: ContractAddress
    ) -> bool;
    fn get_kofia(self: @TContractState, kofia_id: u256) -> Kofia;
    fn get_jacket(self: @TContractState, jacket_id: u256) -> Jacket;
    fn get_pant(self: @TContractState, pant_id: u256) -> Pants;
    fn generate_color(ref self:TContractState, seed: u64) -> Color;
    fn generate_colors(
        ref self: TContractState
    ) -> Color;
    fn mix_colors(ref self :TContractState,color1: Color, color2: Color) -> Color;
    fn skin_type_to_u8(ref self :TContractState, skin_type: SkinType) -> u8;
    fn update_skin( ref self:TContractState,skin_id: u256, skin_type: SkinType, runaway_id: u256, caller_ownership: ContractAddress) ->  bool;
    fn get_runaway_kofias(self: @TContractState, runaway_id: u256,owner: ContractAddress) -> Array<Kofia>;
    fn get_runaway_jackets(self: @TContractState, runaway_id: u256,owner: ContractAddress) -> Array<Jacket>;
    fn get_runaway_pants(self: @TContractState, runaway_id: u256,owner: ContractAddress) -> Array<Pants>;
    fn approve_kofia_metadata(ref self:TContractState, kofia_id: u256);
    fn approve_jacket_metadata(ref self:TContractState, jacket_id: u256);
    fn approve_pants_metadata(ref self:TContractState, pants_id: u256);
}


#[starknet::contract]
pub mod SkinContract {

    use starknet::{
        ContractAddress, contract_address_const, get_block_number, get_caller_address,
        get_contract_address, get_block_timestamp
    };

    use super::{Color,ISkinContract,SkinType,Pants,Kofia,Jacket};

    const LCG_MULTIPLIER: u64 = 1103515245;
    const LCG_INCREMENT: u64 = 12345;
    const LCG_MODULUS: u64 = 0x100000000; // 2^32

    #[storage]
    pub struct Storage {
        
        pub kofias: LegacyMap::<u256, Kofia>,
        pub jackets: LegacyMap::<u256, Jacket>,
        pub pants: LegacyMap::<u256, Pants>,
        pub next_kofia_skin_id: u256,
        pub next_pant_skin_id: u256,
        pub next_jacket_skin_id: u256,
        pub last_request: u64,
        pub last_request_id: u64,
        pub user_skin: LegacyMap<ContractAddress, bool>,
        pub runaway_kofia_skins: LegacyMap<(ContractAddress, u256), Kofia>,
        pub runaway_jacket_skins: LegacyMap<(ContractAddress, u256), Jacket>,
        pub runaway_pants_skins: LegacyMap<(ContractAddress, u256), Pants>,

    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {

    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_kofia_skin_id.write(1);
        self.next_pant_skin_id.write(1);
        self.next_jacket_skin_id.write(1);
    }
    
    
    #[abi(embed_v0)]
    impl SkinImpl of super::ISkinContract<ContractState> {


        fn create_skin(
            ref self: ContractState,
            skin_type: SkinType,
            token_id: u256,
            runaway_id: u256,
            creator: ContractAddress,
        )  -> bool{

            let request_time = get_block_timestamp();
            let request_time_difference = request_time - self.last_request.read();

            assert(
                request_time_difference >= 60,
                'Skin creation Underway'
            );

            let color = self.generate_colors();


            match skin_type {
                SkinType::Kofia => {
                    let kofia = Kofia { color, runaway_id, token_id,tba_owner: creator,user: creator,metadata_updated: false };
                    let kofia_id = self.next_kofia_skin_id.read();
                    self.kofias.write(kofia_id, kofia);
                    self.next_kofia_skin_id.write(kofia_id + 1);
                    self.runaway_kofia_skins.write((creator, kofia_id), kofia);
                },
                SkinType::Jacket => {
                    let jacket = Jacket { color, runaway_id, token_id,tba_owner: creator,user: creator,metadata_updated: false };
                    let jacket_id = self.next_jacket_skin_id.read();
                    self.jackets.write(jacket_id, jacket);
                    self.next_jacket_skin_id.write(jacket_id + 1);
                    self.runaway_jacket_skins.write((creator, jacket_id), jacket);

                },
                SkinType::Pants => {
                    let pants = Pants { color, runaway_id, token_id,tba_owner: creator,user: creator,metadata_updated: false };
                    let pant_id = self.next_pant_skin_id.read();
                    self.pants.write(pant_id, pants);
                    self.next_pant_skin_id.write(pant_id + 1);
                    self.runaway_pants_skins.write((creator, pant_id), pants);
                },
            } 


            true  

        }


        fn update_skin( ref self:ContractState,skin_id: u256, skin_type: SkinType, runaway_id: u256, caller_ownership: ContractAddress) ->  bool{

            let caller = get_caller_address();

            assert(caller == caller_ownership,'Must be the ownership contract');

            match skin_type {
                SkinType::Kofia => {
                    let mut kofia = self.kofias.read(skin_id);
                    kofia.runaway_id = runaway_id;
                    self.kofias.write(skin_id, kofia);
                },
                SkinType::Jacket => {
                    let mut jacket = self.jackets.read(skin_id);
                    jacket.runaway_id = runaway_id;
                    self.jackets.write(skin_id, jacket);
                },
                SkinType::Pants => {
                    let mut pants = self.pants.read(skin_id);
                    pants.runaway_id =  runaway_id;
                    self.pants.write(skin_id,pants)    
                },
            } 


            true

        }


        fn get_kofia(self: @ContractState, kofia_id: u256) -> Kofia{
            self.kofias.read(kofia_id)
        }
        fn get_jacket(self: @ContractState, jacket_id: u256) -> Jacket{
            self.jackets.read(jacket_id)
        }
        fn get_pant(self: @ContractState, pant_id: u256) -> Pants{
           self.pants.read(pant_id)
        }

        fn generate_colors(
            ref self: ContractState
        ) -> Color {

            let timestamp: u64 = get_block_timestamp();
            
            let seed1: u64 = (timestamp.into()) % LCG_MODULUS;


                self.generate_color(seed1)
     
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

        fn skin_type_to_u8(ref self :ContractState, skin_type: SkinType) -> u8 {
            match skin_type {
                SkinType::Kofia => 0,
                SkinType::Jacket => 1,
                SkinType::Pants => 2,
            }
        }

        fn get_runaway_kofias(self: @ContractState, runaway_id: u256, owner: ContractAddress) -> Array<Kofia>{

            let mut kofias = ArrayTrait::<Kofia>::new();

            let total_kofias = self.next_kofia_skin_id.read() - 1;

            let mut count = 1;

            if total_kofias > 0 {
                loop {

                    if (count > total_kofias){
                        break;
                    }

                    let kofia  = self.runaway_kofia_skins.read((owner, count));

                    if kofia.token_id > 0 && (kofia.runaway_id == runaway_id) {
                        kofias.append(kofia);
                    }

                    count += 1;
                }
            }

            kofias  
        }
        fn get_runaway_jackets(self: @ContractState, runaway_id: u256, owner: ContractAddress) -> Array<Jacket>{

            let mut jackets = ArrayTrait::<Jacket>::new();

            let total_jackets = self.next_jacket_skin_id.read() - 1;

            let mut count = 1;

            if total_jackets > 0 {
                loop {

                    if (count > total_jackets){
                        break;
                    }

                    let jacket  = self.runaway_jacket_skins.read((owner, count));

                    if jacket.token_id > 0 && (jacket.runaway_id == runaway_id) {
                        jackets.append(jacket);
                    }

                    count += 1;
                }
            }

            jackets
        }

        fn get_runaway_pants(self: @ContractState, runaway_id: u256, owner: ContractAddress) -> Array<Pants>{

            let mut pants = ArrayTrait::<Pants>::new();

            let total_pants = self.next_pant_skin_id.read() - 1;

            let mut count = 1;

            if total_pants > 0 {
                loop {

                    if (count > total_pants){
                        break;
                    }

                    let pant  = self.runaway_pants_skins.read((owner, count));

                    if pant.token_id > 0 && (pant.runaway_id == runaway_id) {
                        pants.append(pant);
                    }

                    count += 1;
                }
            }

            pants
        }

        fn approve_kofia_metadata(ref self:ContractState, kofia_id: u256){

                let caller = get_caller_address();

                let mut  kofia = self.kofias.read(kofia_id);

                assert(kofia.user == caller,'Not User');

                kofia.metadata_updated = true;

                self.kofias.write(kofia_id, kofia);

        }

        fn approve_jacket_metadata(ref self:ContractState, jacket_id: u256){
            let caller = get_caller_address();

            let mut  jacket = self.jackets.read(jacket_id);

            assert(jacket.user == caller,'Not User');

            jacket.metadata_updated = true;

            self.jackets.write(jacket_id, jacket);
        }

        fn approve_pants_metadata(ref self:ContractState, pants_id: u256){

            let caller = get_caller_address();

            let mut pants = self.pants.read(pants_id);

            assert(pants.user == caller,'Not User');

            pants.metadata_updated = true;

            self.pants.write(pants_id, pants);

        }

    }

  


}
