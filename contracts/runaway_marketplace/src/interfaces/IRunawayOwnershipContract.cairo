use starknet::ContractAddress;

#[starknet::interface]
pub trait IRunawayOwnershipContract<TContractState> {
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
    fn add_kofia_skin_token_to_runaway_marketplace(ref self:TContractState, kofia_id: u256, price: felt252);
    fn add_jacket_skin_token_to_runaway_marketplace(ref self:TContractState, jacket_id: u256, price: felt252);
    fn add_pants_skin_token_to_runaway_marketplace(ref self:TContractState, pants_id: u256, price: felt252);

}