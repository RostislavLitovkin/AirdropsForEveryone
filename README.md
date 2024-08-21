# Token Airdrops for everyone in Polkadot

## Project description

An udpate to existing assets pallet in Polkadot SDK to allow multiple-times efficient airdrops. It is usefull for memecoins :)

## How to run

### Run locally

You need to complete 3 steps
1) build and run the blockchain (or use the mainnet once the PR is merged) (https://github.com/paritytech/polkadot-sdk/pull/5400)

2) build and run the Airdrop REST API, that takes care of the airdrop data (saving and providing the .csv files...)
```
git clone https://github.com/RostislavLitovkin/PlutoExpress/tree/ClaimAirdropApi

yarn

yarn start
```

3) run the React UI (or open the website once deployed)
```
cd app

yarn start
```

## How to re-build wasm-bindings

Before rebuilding, if you use Mac ensure that you have got the correct LLVM installed: https://github.com/briansmith/ring/issues/1824

```
cd merkleproof

wasm-pack build --out-dir ../app/src/wasm-build
```

