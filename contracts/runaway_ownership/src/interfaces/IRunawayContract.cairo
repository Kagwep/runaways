use starknet::ContractAddress;
use runaway_ownership::runaway_customs::{Runaway, Color};

#[starknet::interface]
pub trait IRunawayContract<TContractState> {
    fn create_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256) -> (u256, Runaway);
    fn create_offspring_runaway( ref self:TContractState,caller: ContractAddress, runaway_token_id:u256, runaway_id: u256) -> (u256, Runaway);
    fn update_runaway( ref self:TContractState,runaway_id: u256, weight:u64, experience:u64) -> Runaway;
    fn get_runaway(self: @TContractState, runaway_id: u256) -> Runaway;
    fn generate_color(ref self:TContractState, seed: u64) -> Color;
    fn generate_colors(
        ref self: TContractState
    ) -> (Color, Color, Color, Color);
    fn mix_colors(ref self :TContractState,color1: Color, color2: Color) -> Color;
}
