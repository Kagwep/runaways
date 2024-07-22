use starknet::ContractAddress;

#[starknet::interface]
trait IRunAwayNFT<TContractState> {
    fn mint(ref self: TContractState, recipient: ContractAddress, token_id:u256) -> u256;
}

#[starknet::contract]
mod RunAwayNFT {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::ContractAddress;
    use super::IRunAwayNFT;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        next_token_id: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "RunAwayNFT";
        let symbol = "RAN";
        let base_uri = "https://gcqzhwxcljffjobytgaa.supabase.co/functions/v1/get-nft-image?token_id=";
        self.erc721.initializer(name, symbol, base_uri);
    }

    #[abi(embed_v0)]
    impl RunAwayNFTImpl of IRunAwayNFT<ContractState> {

        fn mint(ref self: ContractState, recipient: ContractAddress, token_id:u256) -> u256 {
            self.erc721.mint(recipient, token_id);
            token_id
        }
         
    }

}