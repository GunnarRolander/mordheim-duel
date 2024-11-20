import React from 'react';

const WinRateBar = ({ percentage1, percentage2 }) => {
    const total = percentage1 + percentage2;
    const percentage1Width = (percentage1 / total) * 100;
    const percentage2Width = (percentage2 / total) * 100;

    return (
        <div style={{ display: 'flex', width: '100%', height: '30px', border: '1px solid #000' }}>
            <div style={{ width: `${percentage1Width}%`, backgroundColor: '#42b0f5', border: '1px solid #000' }}>{percentage1.toFixed(2)}%</div>
            <div style={{ width: `${percentage2Width}%`, backgroundColor: '#fc632b', border: '1px solid #000' }}>{percentage2.toFixed(2)}%</div>
        </div>
    );
};

export default WinRateBar;