/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { weapons, armour } from './equipment.js';

const WarriorComponent = ({ handleWarriorChange }) => {
    const [formData, setFormData] = useState({
        WS: 3,
        BS: 3,
        S: 3,
        T: 3,
        W: 1,
        I: 3,
        A: 1,
        LD: 7,
        mainHand: '',
        offHand: '',
        selectedArmour: []
    });

    useEffect(() => {
        handleWarriorChange(formData);
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        handleWarriorChange(formData)
    };

    const handleMultiSelectChange = (e) => {
        const options = e.target.options;
        const selectedOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedOptions.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            selectedArmour: selectedOptions
        });
    };

    return (
      <form>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>WS</label>
                <label>BS</label>
                <label>S</label>
                <label>T</label>
                <label>W</label>
                <label>I</label>
                <label>A</label>
                <label>LD</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input type="number" name="WS" value={formData.WS} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="BS" value={formData.BS} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="S" value={formData.S} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="T" value={formData.T} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="W" value={formData.W} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="I" value={formData.I} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="A" value={formData.A} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
                <input type="number" name="LD" value={formData.LD} onChange={handleChange} min="0" max="10" style={{ width: '2em' }} />
            </div>
        </div>
        <div>
            <label>Main hand </label>
            <select name="mainHand" value={formData.mainHand} onChange={handleChange}>
                {Object.keys(weapons).map((weapon) => (
                    <option key={weapon} value={weapon}>{weapon}</option>
                ))}
            </select>
        </div>
        <div>
            <label>Offhand </label>
            <select name="offHand" value={formData.offHand} onChange={handleChange}>
                {Object.keys(weapons).map((weapon) => (
                    <option key={weapon} value={weapon}>{weapon}</option>
                ))}
            </select>
        </div>
        <div>
            <label>Armour </label>
            <select multiple name="selectedArmour" value={formData.selectedArmour} onChange={handleMultiSelectChange}>
                {Object.keys(armour).map((armourItem) => (
                    <option key={armourItem} value={armourItem}>{armourItem}</option>
                ))}
            </select>
        </div>
      </form>
    );
};

export default WarriorComponent;