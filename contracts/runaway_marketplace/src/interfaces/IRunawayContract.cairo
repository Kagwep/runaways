use starknet::ContractAddress;

use runaway_marketplace::runaway_customs::{Runaway,Kofia,Jacket,Pants,Color};

#[starknet::interface]
pub trait IRunawayContract<TContractState> {
    fn create_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256) -> (u256, Runaway);
    fn create_offspring_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256, runaway_id: u256) -> (u256, Runaway);
    fn update_runaway( ref self:TContractState,runaway_id: u256, experience:u64) -> Runaway;
    fn get_runaway(self: @TContractState, runaway_id: u256) -> Runaway;
    fn generate_color(ref self:TContractState, seed: u64) -> Color;
    fn generate_colors(
        ref self: TContractState
    ) -> (Color, Color, Color, Color);
    fn mix_colors(ref self :TContractState,color1: Color, color2: Color) -> Color;
    fn get_user_runaways(self :@TContractState) -> Array<Runaway>;
}