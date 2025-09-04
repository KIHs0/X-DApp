import Home from "./home.jsx";
import X from './components/x.jsx'
import { useState } from "react";

function App() {
    const [wallet, setWallet] = useState(null);
    return (<>
        {!wallet ? (
            <Home setWallet={setWallet} wallet={wallet} />
        ) : (
            <X wallet={wallet} setWallet={setWallet} />
        )
        }
    </>)
}


export default App
