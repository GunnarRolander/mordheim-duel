/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { armour } from './equipment.js';

const ArmourComponent = ({ handleArmourChange }) => {
  const [armourData, setArmourData] = useState({
    selectedArmour: [],
    armourSave: 7
  });

  useEffect(() => {
    handleArmourChange(armourData);
  }, [armourData])

  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            selectedOptions.push(options[i].value);
        }
    }

    const equippedArmour = selectedOptions.map((type) => armour[type])
    const armourSave = equippedArmour.reduce((acc, armour) => acc - armour.save, 7)

    setArmourData({
      armourSave: armourSave,
      selectedArmour: selectedOptions
    });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setArmourData({
        selectedArmour: [],
        armourSave: value
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ textAlign: 'left'}}>
        <label>Armour Save (7 means no save)</label><br/>
        <label>Equipped Armour</label>
      </div>
      <div>
        <input style={{ float: 'right', width: '2em' }} type="number" name="armourSave" value={armourData.armourSave} onChange={handleChange} min="0" max="10" />
        <br/>
        <select style={{ float: 'right' }} multiple name="selectedArmour" value={armourData.selectedArmour} onChange={handleMultiSelectChange}>
            {Object.keys(armour).map((armourItem) => (
                <option key={armourItem} value={armourItem}>{armourItem}</option>
            ))}
        </select>
      </div>
    </div>
  )

}
export default ArmourComponent;