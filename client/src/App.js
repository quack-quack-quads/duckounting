import './App.css';
import { ConnectButton } from 'web3uikit';
function App() {
  return (
    <div className="App">
      <ConnectButton moralisAuth={true}/>
    </div>
  );
}

export default App;
