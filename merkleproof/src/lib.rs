use wasm_bindgen::prelude::*;
use binary_merkle_tree;
use sp_runtime::traits::BlakeTwo256;
use sp_runtime::testing::sr25519;
use sp_core::H256;
use sp_runtime::codec::{Decode, Encode};
use binary_merkle_tree::Leaf;

type AccountId = sr25519::Public;

type Balance = u128;

#[wasm_bindgen]
pub fn verify_proof(
    mut root_encoded: &[u8],
    mut proof_encoded: &[u8],
    number_of_leaves: u64,
    leaf_index: u64,
    mut leaf_account_encoded: &[u8],
    mut leaf_balance_encoded: &[u8]
) -> bool {
    let root = H256::decode(&mut root_encoded).unwrap();
    let proof = Vec::<H256>::decode(&mut proof_encoded).unwrap();

    let leaf_decoded = (AccountId::decode(&mut leaf_account_encoded).unwrap(), Balance::decode(&mut leaf_balance_encoded).unwrap());

    let leaf_hashed = leaf_decoded.using_encoded(sp_io::hashing::blake2_256);

    let leaf = Leaf::<H256>::Value(&leaf_hashed);

    let verified = binary_merkle_tree::verify_proof::<BlakeTwo256, _, Leaf<H256>>(
		&root,
		proof,
        number_of_leaves as usize,
		leaf_index as usize,
		leaf,
    );

    verified
}

#[wasm_bindgen]
pub fn merkle_root(
    mut leaves_hashed: &[u8],
) -> Vec<u8> {
    let leaves = Vec::<H256>::decode(&mut leaves_hashed).unwrap();

    let root = binary_merkle_tree::merkle_root::<BlakeTwo256, Vec<H256>>(
        leaves
    );

    root.encode()
}

#[wasm_bindgen]
pub fn merkle_proof(
    mut leaves_hashed: &[u8],
    leaf_index: u64,
) -> Vec<u8> {
    let leaves = Vec::<H256>::decode(&mut leaves_hashed).unwrap();

    let root = binary_merkle_tree::merkle_proof::<BlakeTwo256, Vec<H256>, H256>(
        leaves,
        leaf_index as usize
    );

    root.proof.encode()
}
