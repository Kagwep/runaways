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
    pub runaway_token_id: u256,
    pub genes: RunawayGenes,
    pub created_at: u64,   
    pub experience: u64,
    pub nr_children: u16,    
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
