/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { skills } from './equipment.js';

const SkillsComponent = ({ handleSkillsChange }) => {
  const [skillsData, setSkillsData] = useState({
    selectedSkills: []
  });

  useEffect(() => {
    handleSkillsChange(skillsData);
  }, [skillsData])

  const handleMultiSelectChange = (e) => {
    const options = e.target.options;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            selectedOptions.push(options[i].value);
        }
    }

    setSkillsData({
      selectedSkills: selectedOptions
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ textAlign: 'left'}}>
        <label>Skills</label>
      </div>
      <div>
        <select style={{ float: 'right' }} multiple name="selectedSkills" value={skillsData.selectedSkills} onChange={handleMultiSelectChange}>
            {Object.keys(skills).map((skillsItem) => (
                <option key={skillsItem} value={skillsItem}>{skillsItem}</option>
            ))}
        </select>
      </div>
    </div>
  )

}
export default SkillsComponent;