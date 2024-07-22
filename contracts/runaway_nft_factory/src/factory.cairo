use starknet::ContractAddress;

#[starknet::interface]
trait IRunAwayNFTFactory<TContractState> {
    fn deploy_and_mint(
        ref self: TContractState,
        recipient: ContractAddress,
    ) -> (ContractAddress, u256);
    fn get_nft_count(self: @TContractState) -> u32;
}


#[starknet::contract]
mod RunAwayNFTFactory {
    use core::traits::TryInto;
use starknet::{ContractAddress,get_block_timestamp};
    use starknet::class_hash::ClassHash;
    use super::IRunAwayNFTFactory;
    use starknet::syscalls;


    #[storage]
    struct Storage {
        nft_class_hash: ClassHash,
        created_nfts: LegacyMap::<u32, (ContractAddress, u256)>,
        nft_count: u32,
        next_token_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct RunAwayNFTCreated {
        nft_contract: ContractAddress,
        token_id: u256,
        recipient: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RunAwayNFTCreated: RunAwayNFTCreated,
    }

    #[constructor]
    fn constructor(ref self: ContractState, nft_class_hash: ClassHash) {
        self.nft_class_hash.write(nft_class_hash);
        self.nft_count.write(0);
        self.next_token_id.write(1);
        
    }


    #[abi(embed_v0)]
    impl RunAwayNFTFactoryImpl of IRunAwayNFTFactory<ContractState> {
        
        fn deploy_and_mint(ref self: ContractState, recipient: ContractAddress) -> (ContractAddress, u256) {

            let nft_class_hash = self.nft_class_hash.read();

            let salt = get_block_timestamp();

            let new_salt: felt252 = salt.into();
            
            // Deploy new NFT contract
            let (contract_address,_) = syscalls::deploy_syscall(
                nft_class_hash,
                new_salt,
                array![].span(), // calldata
                false // deploy_from_zero
            ).unwrap();

            let token_id = self.next_token_id.read();
    
            // Call mint function on the new contract
            let mut calldata = array![];
            calldata.append(recipient.into());
            calldata.append(token_id.into());
            let result = syscalls::call_contract_syscall(
                contract_address,
                selector!("mint"),
                calldata.span()
            ).unwrap();
    
            let token_id = *result.at(0);

            self.nft_count.write(self.nft_count.read() + 1);

            (contract_address, token_id.try_into().unwrap())
        }

        fn get_nft_count(self: @ContractState) -> u32 {
            self.nft_count.read()
        }

    }
}