import React, { useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useSelect, WalletProvider, useRecords } from "aleo-hooks";

import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
  configureConnectionForPuzzle
} from 'aleo-adapters';
import "./App.css";
import WalletModal from "./component/WalletModal";


function ConnectWalletButton (){
  const account = useAccount()
  const {connect, connected, address, connecting, error}  = useConnect()
  const {disconnect} = useDisconnect()
  const {select} = useSelect()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleWalletSelect = (walletId) => {
const walletAdapterMap = {
  'leo-wallet': 'Leo Wallet',
  'puzzle-wallet': 'Puzzle Wallet',
  'fox-wallet': 'Fox Wallet',
  'soter-wallet': 'Soter Wallet'
}
const adapterId = walletAdapterMap[walletId]
if (!adapterId) {
  console.error(`Unknown wallet ID: ${walletId}`)
  return
}

select(adapterId)
setIsModalOpen(false)

setTimeout(() => {
  connect(adapterId)
  }, 100)
}

const handleClick = ()=> {
  if(account.connected){
    disconnect(true)
  } else {
    setIsModalOpen(true)
  }
}
return (
  <>
  <button
  className="connect-wallet-button"
  onClick={handleClick}
  >
    {account.connected ? 'Disconnect wallet' : 'Connect wallet'}
  </button>
  <WalletModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onWalletSelect={handleWalletSelect}
  />
  </>
)

}

function Header(){
  return (
    <header className="app-header">
      <div className="logo">
        Aleo App
      </div>
      <div className="nav-links">

      </div>
      <ConnectWalletButton />
    </header>
  )
}

function Page (){
  const account = useAccount()
  const {records, requestRecords} = useRecords()

  return(
     <div className="app-content">
      {account?.publicKey ? <div>{account.publicKey}</div> : <div>Not connected</div>}
      {account?.publicKey && <button onClick={()=> requestRecords()}>Request Records</button>}
      {
        records?.map(record => (
          <div key={record.id}>
           
            {record.id}
          </div>
        ))
      }
    </div>
  )
   

}

function App() {
    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: 'Aleo app',
            }),
            new PuzzleWalletAdapter({
                programIdPermissions: {
                  ["AleoMainnet"]: ['dApp_1.aleo', 'dApp_1_import.aleo', 'dApp_1_import_2.aleo'],
                  ["AleoTestnet"]: ['dApp_1_test.aleo', 'dApp_1_test_import.aleo', 'dApp_1_test_import_2.aleo']
                },
                appName: 'Aleo app',
                appDescription: 'A privacy-focused DeFi app',
                
            }),
            new FoxWalletAdapter({
                appName: 'Aleo app',
            }),
            new SoterWalletAdapter({
                appName: 'Aleo app',
            })
        ],
        [],
    );

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <div className="App">
       <Header />
       <Page/>
      </div>
    </WalletProvider>
  );
}


export default App;