import { useState } from 'react'
import './App.css'
import { runSimulateCombat } from './combat.js';
import WarriorComponent from './WarriorComponent.jsx';
import { runTests } from './tests.js';
import WinRateBar from './WinRateBar.jsx';

function App() {
  const [warrior1, setWarrior1] = useState()
  const [warrior2, setWarrior2] = useState()
  const [winRates, setWinRates] = useState({
    win_rate_warrior_1: 0,
    win_rate_warrior_2: 0
  })

  const handleWarrior1Change = (formData) => {
    handleWarriorChange(formData, setWarrior1);
  }

  const handleWarrior2Change = (formData) => {
    handleWarriorChange(formData, setWarrior2);
  }

  const handleWarriorChange = (formData, setWarriorFunction) => {
    setWarriorFunction(formData);
  }

  const runSimulation = () => {
    const winRates = runSimulateCombat(warrior1, warrior2);
    setWinRates(winRates);
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h2>Warrior 1</h2>
              <WarriorComponent
                handleWarriorChange={handleWarrior1Change}
              />
            </div>
            <div style={{ padding: '3em', width: '300px'}}>
              <h3>Result</h3>
              <WinRateBar
                percentage1={winRates.win_rate_warrior_1}
                percentage2={winRates.win_rate_warrior_2}
              />
            </div>
            <div>
              <h2>Warrior 2</h2>
              <WarriorComponent
                handleWarriorChange={handleWarrior2Change}
              />
            </div>
          </div>
        </div>
        <button onClick={() => runSimulation()}>
          simulate combat
        </button>
        <br/>
        <button onClick={() => runTests()}>
          run unit tests
        </button>
      </div>
    </>
  )
}

export default App
