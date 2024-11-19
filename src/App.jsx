import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { runSimulateCombat } from './combat.js';
import WarriorComponent from './WarriorComponent.jsx';

function App() {
  const [warrior1, setWarrior1] = useState()
  const [warrior2, setWarrior2] = useState()

  const handleWarrior1Change = (formData) => {
    handleWarriorChange(formData, setWarrior1);
  }

  const handleWarrior2Change = (formData) => {
    handleWarriorChange(formData, setWarrior2);
  }

  const handleWarriorChange = (formData, setWarriorFunction) => {
    setWarriorFunction(formData);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div>
          <h2>Warrior 1</h2>
          <WarriorComponent
            handleWarriorChange={handleWarrior1Change}
          />
        </div>
        <div>
          <h2>Warrior 2</h2>
          <WarriorComponent
            handleWarriorChange={handleWarrior2Change}
          />
        </div>
        <button onClick={() => runSimulateCombat(warrior1, warrior2)}>
          simulate combat
        </button>
      </div>
    </>
  )
}

export default App
