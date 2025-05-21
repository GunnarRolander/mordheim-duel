import React from 'react';

const WinRateBar = ({
    percentage1,
    percentage2,
    rounds = {
        warrior_1: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0},
        warrior_2: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0}
    }
}) => {
    const total = percentage1 + percentage2;
    const percentage1Width = (percentage1 / total) * 100;
    const percentage2Width = (percentage2 / total) * 100;

    // Extract the first 5 rounds for both warriors
    const warrior1Rounds = Object.values(rounds.warrior_1).slice(0, 9);
    const warrior2Rounds = Object.values(rounds.warrior_2).slice(0, 9);
    warrior1Rounds.push(Object.values(rounds.warrior_1).slice(9, -1).reduce((acc, val) => acc + val, 0));
    warrior2Rounds.push(Object.values(rounds.warrior_2).slice(9, -1).reduce((acc, val) => acc + val, 0));
    const totalRounds = warrior1Rounds.reduce((acc, val) => acc + val, 0) + warrior2Rounds.reduce((acc, val) => acc + val, 0) || 1; // Avoid division by zero
    const warrior1RoundsPercentage = warrior1Rounds.map(round => (round / totalRounds) * 100);
    const warrior2RoundsPercentage = warrior2Rounds.map(round => (round / totalRounds) * 100);

    return (
        <div>
            {/* Main Win Rate Bar */}
            <div style={{ display: 'flex', width: '100%', height: '30px', border: '1px solid #000' }}>
                <div style={{ width: `${percentage1Width}%`, backgroundColor: '#42b0f5', border: '1px solid #000' }}>
                    {percentage1.toFixed(2)}%
                </div>
                <div style={{ width: `${percentage2Width}%`, backgroundColor: '#fc632b', border: '1px solid #000' }}>
                    {percentage2.toFixed(2)}%
                </div>
            </div>

            {/* Round Win Rate Bars */}
            <div style={{ marginTop: '10px' }}>
                {warrior1RoundsPercentage.map((warrior1WinRate, index) => {
                    const warrior2WinRate = warrior2RoundsPercentage[index];
                    const leftWidth = warrior1WinRate; // Win rate for warrior_1
                    const rightWidth = warrior2WinRate; // Win rate for warrior_2
                    const roundNumber = index == 9 ? '10+' : index + 1; // Round number (1-based index)

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '15px',
                                marginBottom: '5px',
                                position: 'relative',
                            }}
                        >
                            {/* Left Win Rate */}
                            <div style={{ position: 'absolute', left: '5px', fontSize: '12px' }}>
                                {warrior1WinRate.toFixed(2)}%
                            </div>

                            {/* Bars */}
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    height: '15px',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${leftWidth}%`,
                                        height: '15px',
                                        backgroundColor: '#42b0f5',
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-100%)',
                                    }}
                                />
                                <div
                                    style={{
                                        width: `${rightWidth}%`,
                                        height: '15px',
                                        backgroundColor: '#fc632b',
                                        position: 'absolute',
                                        left: '50%',
                                    }}
                                />
                            </div>

                            {/* Round Number */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '12px',
                                    zIndex: 1,
                                }}
                            >
                                Round {roundNumber}
                            </div>

                            {/* Right Win Rate */}
                            <div style={{ position: 'absolute', right: '5px', fontSize: '12px' }}>
                                {warrior2WinRate.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WinRateBar;