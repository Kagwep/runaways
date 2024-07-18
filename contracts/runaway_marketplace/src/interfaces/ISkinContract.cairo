use starknet::ContractAddress;

use runaway_marketplace::runaway_customs::{Runaway,Kofia,Jacket,Pants,Color,SkinType};

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
}