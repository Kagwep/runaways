use starknet::ContractAddress;

#[starknet::interface]
pub trait IRunAwayNFTFactory<TContractState> {
    fn deploy_and_mint(
        ref self: TContractState,
        recipient: ContractAddress,
    ) -> (ContractAddress, u256);
    fn get_nft_count(self: @TContractState) -> u32;
}
