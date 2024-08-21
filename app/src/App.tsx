import { useState } from 'react';
import './App.css';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { fetchCsvContent } from './Helpers/FetchCsvContent';
import { calculateMerkleProof } from './Helpers/CalculateMerkleProof';

function App() {

  const [connectWalletText, setConnectWalletText] = useState<string>("Connect Wallet")
  const [claimAmount, setClaimAmount] = useState<number>();

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const [symbol, setSymbol] = useState<string>("")
  const [assetId, setAssetId] = useState<number>(1076)
  const [distributionId, setDistributionId] = useState<number>(0)

  const onConnect = async () => {
    if (connectWalletText !== "Connect Wallet") {
      return;
    }

    setConnectWalletText("Connecting")

    /// Connect a browser wallet
    await web3Enable('Claim Assets');

    const allAccounts = await web3Accounts();

    if (allAccounts.length === 0) {
      setConnectWalletText("No wallets installed")

      return;
    }

    const selectedAddress = allAccounts[0].address

    const injector = await web3FromAddress(selectedAddress)

    setConnectWalletText("Connected to " + selectedAddress.slice(0, 4) + "..")

    /// Fetch the CSV for as token drop
    const airdropDict = await fetchCsvContent(symbol)

    setClaimAmount(airdropDict[selectedAddress].amount ?? 0)

    /*const wsProvider = new WsProvider('ws://127.0.0.1:9944')
    const api = await ApiPromise.create({ provider: wsProvider })*/

    /// Do multiquery and find AssetId for the right token name
    /// Do multiquery and find distribution id for the right token
    setAssetId(1076)
    setDistributionId(0)

    /// Check that the user has not claimed the distribution yet
    /*const result = await api.query.assets.merklizedDistributionTracker(distributionId, selectedAddress)

    if (result === null) {
      return
    }*/

    calculateMerkleProof(airdropDict, airdropDict[selectedAddress].index)

    /*api.tx.balances
      .transfer('5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ', 123456)
      .signAndSend(selectedAddress, { signer: injector.signer });

      */
  }

  const check_claim = async (api: ApiPromise) => {
    
  }

  return (
    <div className="App">
      <header className="App-header">
      <input
        type="text"
        id="textInput"
        value={symbol}
        onChange={handleSymbolChange}
        placeholder='symbol'
      />
        <button onClick={onConnect} disabled={symbol === ""}>{connectWalletText}</button>
        <p>{claimAmount}</p>
      </header>
    </div>
  );
}

export default App;

