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
    use starknet::ContractAddress;
    use starknet::class_hash::ClassHash;
    use super::IRunAwayNFTFactory;
    use starknet::syscalls;

    #[storage]
    struct Storage {
        nft_class_hash: ClassHash,
        created_nfts: LegacyMap::<u32, (ContractAddress, u256)>,
        nft_count: u32,
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
    }


    #[abi(embed_v0)]
    impl RunAwayNFTFactoryImpl of IRunAwayNFTFactory<ContractState> {
        
        fn deploy_and_mint(ref self: ContractState, recipient: ContractAddress) -> (ContractAddress, u256) {
            let nft_class_hash = self.nft_class_hash.read();
            
            // Deploy new NFT contract
            let (contract_address,_) = syscalls::deploy_syscall(
                nft_class_hash,
                0, // calldata_size
                array![].span(), // calldata
                false // deploy_from_zero
            ).unwrap();
    
            // Call mint function on the new contract
            let mut calldata = array![];
            calldata.append(recipient.into());
            let result = syscalls::call_contract_syscall(
                contract_address,
                selector!("mint"),
                calldata.span()
            ).unwrap();
    
            let token_id = *result.at(0);
            (contract_address, token_id.try_into().unwrap())
        }

        fn get_nft_count(self: @ContractState) -> u32 {
            self.nft_count.read()
        }

    }
}