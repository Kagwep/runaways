use starknet::ContractAddress;
use core::array::ArrayTrait;

use runaway_ownership::runaway_customs::{Runaway,Kofia,Jacket,Pants, PantsMarketplace, KofiaMarketplace, JacketMarketplace, RunawayMarketplace};

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