use starknet::ContractAddress;

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct RunawayGenes {
    pub body_color: Color,
    pub eye_color: Color,
    pub mouth_color: Color,
    pub comb_color: Color,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Runaway {
    pub runaway_id: u256,
    pub runaway_token_id: u256,
    pub genes: RunawayGenes,
    pub created_at: u64,   
    pub experience: u64,
    pub nr_children: u16, 
    pub tb_owner: ContractAddress,
    pub user: ContractAddress,   
}



#[derive(Drop, Serde, Copy, starknet::Store)]
pub enum SkinType {
    Kofia,
    Jacket,
    Pants,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Kofia {
    color: Color,
    runaway_id: u256,
    token_id: u256,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Jacket {
    color: Color,
    runaway_id: u256,
    token_id: u256,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct Pants {
    color: Color,
    runaway_id: u256,
    token_id: u256,
}

#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct PantsMarketplace {
    pub pants_marketplace_id: u256,
    pub pants: Pants,
    pub price: felt252,
    pub nft_contract_address: ContractAddress,
}


#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct RunawayMarketplace {
    pub runaway_marketplace_id: u256,
    pub runaway: Runaway,
    pub price: felt252,
    pub nft_contract_address: ContractAddress,
}


#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct JacketMarketplace {
    pub jacket_marketplace_id: u256,
    pub jacket: Jacket,
    pub price: felt252,
    pub nft_contract_address: ContractAddress,
}


#[derive(Drop, Serde, Copy, starknet::Store)]
pub struct KofiaMarketplace {
    pub kofia_marketplace_id: u256,
    pub kofia: Kofia,
    pub price: felt252,
    pub nft_contract_address: ContractAddress,
}

