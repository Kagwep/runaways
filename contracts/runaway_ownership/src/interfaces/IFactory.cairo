use starknet::ContractAddress;

#[starknet::interface]
pub trait IFactory<TContractState> {
    fn create_account(
        ref self: TContractState,
        nft_contract_address: ContractAddress,
        nft_token_id: u256,
        implementation_hash: felt252,
        salt: felt252,
    ) -> ContractAddress;
    fn get_account(
        self: @TContractState,
        nft_contract_address: ContractAddress,
        nft_token_id: u256,
        implementation_hash: felt252,
        salt: felt252,
    ) -> ContractAddress;
}
