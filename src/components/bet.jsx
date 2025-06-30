/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const Bet = ({ winrate1, winrate2 }) => {
    const [betAmount, setBetAmount] = useState(5);
    return (
        <div style={{ marginBottom: '8px'}}>
            <label>
                Bet Amount:&nbsp;
                <input
                    type="number"
                    min={1}
                    value={betAmount}
                    onChange={e => setBetAmount(Number(e.target.value))}
                    style={{ width: '2em' }}
                />
            </label>
            <div>Payouts:
                <div><b>Warrior 1:</b> {Math.floor((100 / winrate1) * betAmount)} gc</div>
                <div><b>Warrior 2:</b> {Math.floor((100 / winrate2) * betAmount)} gc</div>
            </div>
        </div>
    );
};

export default Bet;