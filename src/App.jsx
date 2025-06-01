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
  const [houseRules, setHouseRules] = useState({
    minus1ToHitOffhand: false,
    minus2ToHitOffhand: false,
    minusToHitDW: false,
    addWSToParry: false,
    ogSpears: false,
    ap5: false,
    noStrengthBasedAP: false
  })
  const [nrOfSimulations, setNrOfSimulations] = useState(100000)
  const [spinnerVisible, setSpinnerVisible] = useState(false) // <-- Spinner state

  const handleRuleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHouseRules({
        ...houseRules,
        [name]: type === 'checkbox' ? checked : value
    });
};

  const handleWarrior1Change = (formData) => {
    handleWarriorChange(formData, setWarrior1);
  }

  const handleWarrior2Change = (formData) => {
    handleWarriorChange(formData, setWarrior2);
  }

  const handleWarriorChange = (formData, setWarriorFunction) => {
    setWarriorFunction(formData);
  }

  const runSimulation = (nrOfSimulations) => {
    setSpinnerVisible(true); // Show spinner before starting the simulation
    setTimeout(() => {
      const winRates = runSimulateCombat(warrior1, warrior2, houseRules, nrOfSimulations);
      setWinRates(winRates);
      setSpinnerVisible(false); // Hide spinner after the simulation is done
    }, 100); // Allow React to update the spinner state before running the simulation    
  }

  return (
    <>
      <div className="card">
        {spinnerVisible && (
          <div className="spinner" style={{ textAlign: 'center', margin: '1em' }}>
            <span role="status">🌀 Running calculations, please wait...</span>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h2>Warrior 1</h2>
              <WarriorComponent
                handleWarriorChange={handleWarrior1Change}
              />
            </div>
            <div style={{ 'padding-left': '3em', 'padding-right': '3em', 'padding-bottom': '1em', width: '300px'}}>
              <h3>Result</h3>
              <WinRateBar
                percentage1={winRates.win_rate_warrior_1 || 50}
                percentage2={winRates.win_rate_warrior_2 || 50}
                rounds={winRates.final_rounds}
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>House Rules</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'left'}}>
              <label>Minus -1 to hit on offhand attack when dualwielding</label><br/>
              <label>Minus -2 to hit on offhand attack when dualwielding</label><br/>
              <label>Minus -1 to hit on all attacks when dualwielding</label><br/>
              <label>Add WS to parry rolls</label><br/>
              <label>Use original spear rules</label><br/>
              <label>AP starts at S5</label><br/>
              <label>No strengthbased AP</label><br/>
            </div>
            <div>
              <input type="checkbox" name="minus1ToHitOffhand" checked={houseRules.minus1ToHitOffhand} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="minus2ToHitOffhand" checked={houseRules.minus2ToHitOffhand} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="minusToHitDW" checked={houseRules.minusToHitDW} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="addWSToParry" checked={houseRules.addWSToParry} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="ogSpears" checked={houseRules.ogSpears} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="ap5" checked={houseRules.ap5} onChange={handleRuleChange} /><br/>
              <input type="checkbox" name="noStrengthBasedAP" checked={houseRules.noStrengthBasedAP} onChange={handleRuleChange} /><br/>
            </div>
          </div>
        </div>
        <div>
          <h3>Simulation parameters</h3>
          <label>Number of simulations  </label>
          <input type="number" name="nrOfSimulations" value={nrOfSimulations} onChange={(e) => setNrOfSimulations(e.target.value)} min="0" max="1000000000" style={{ width: '7em' }} />
        </div>
        <br/>
        <button onClick={() => runSimulation(nrOfSimulations)}>
          simulate combat
        </button>
        <br/>
        <br/>
        <button onClick={() => runTests()}>
          run unit tests
        </button>
      </div>
    </>
  )
}

export default App
