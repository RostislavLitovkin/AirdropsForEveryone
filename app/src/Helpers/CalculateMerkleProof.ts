import { AirdropValue } from "../Interfaces/AirdropValue";
import { merkle_proof } from "../wasm-build/merkleproof";
import { decodeAddress } from '@polkadot/util-crypto';
import { TypeRegistry, u128 } from "@polkadot/types"
import { blake2AsU8a } from '@polkadot/util-crypto'
import { Vec } from "@polkadot/types/codec"

export function calculateMerkleProof(airdropDict: Record<string, AirdropValue>, leafIndex: number) {
    let leaves: Uint8Array[] = []
    for (const key in airdropDict) {
        const address = decodeAddress(key)

        // Create a new instance of TypeRegistry
        const registry = new TypeRegistry();

        // Create an instance of u128 with the number
        const encoded = new u128(registry, airdropDict[key].amount);

        // Convert the encoded value to a byte array
        const encodedAmount = encoded.toU8a();

        // Concatenate
        const concatenatedArray = new Uint8Array(address.length + encodedAmount.length);

        // Copy elements from the first array into the new array
        concatenatedArray.set(address, 0);

        // Copy elements from the second array into the new array, starting after the first array
        concatenatedArray.set(encodedAmount, address.length);

        const hashed = blake2AsU8a(concatenatedArray, 256)

        leaves.push(hashed)
        console.log(`${key} : ${airdropDict[key]} - ${hashed}`)
    }

    // Calculate the total length of the concatenated Uint8Array
    const totalLength = leaves.reduce((sum, arr) => sum + arr.length, 0);

    // Create a new Uint8Array with the calculated length
    const concatenatedArray = new Uint8Array(totalLength);

    // Copy data from each Uint8Array into the new Uint8Array
    let offset = 0;
    for (const arr of leaves) {
        concatenatedArray.set(arr, offset);
        offset += arr.length;
    }

    merkle_proof(concatenatedArray, BigInt(leafIndex))
}