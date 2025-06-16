/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { weapons, armour, ranged_weapons, skills, psychology, abilities } from './equipment.js';
import ArmourComponent from './ArmourComponent.jsx';
import Accordion from './components/accordion.jsx';
import TagList from './components/taglist.jsx';

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
        mainHand: 'handweapon',
        mainHandPistol: 'emptyHand',
        offHand: 'emptyHand',
        offHandPistol: 'emptyHand',
        selectedArmour: [],
        charger: false,
        tags: [],
        armourSave: 7,
        skills: [],
    });

    useEffect(() => {
        handleWarriorChange(formData);
    }, [formData])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleTagChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevFormData) => {
            const newTags = checked
                ? [...prevFormData.tags, name]
                : prevFormData.tags.filter((tag) => tag !== name);
            return {
                ...prevFormData,
                tags: newTags
            };
        });
    }

    const handleSkillsChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevFormData) => {
            const newSkills = checked
                ? [...prevFormData.skills, name]
                : prevFormData.skills.filter((skill) => skill !== name);
            return {
                ...prevFormData,
                skills: newSkills
            };
        });
    }

    const handleArmourChange = (armourData) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedArmour: armourData.selectedArmour,
            armourSave: armourData.armourSave
        }));
    }

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
        <ArmourComponent handleArmourChange={handleArmourChange} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left'}}>
                <label>Main hand </label><br/>
                <label>Main hand (pistol) </label><br/>
                <label>Offhand </label><br/>
                <label>Offhand (pistol) </label><br/>
                <label>Charger</label><br/>
            </div>
            <div>
                <select style={{ float: 'right' }} name="mainHand" value={formData.mainHand} onChange={handleChange}>
                    {Object.keys(weapons).map((weapon) => (
                        <option key={weapon} value={weapon}>{weapon}</option>
                    ))}
                </select><br/>
                <select style={{ float: 'right' }} name="mainHandPistol" value={formData.mainHandPistol} onChange={handleChange}>
                    <option key="emptyOffhand" value="emptyHand">No weapon</option>
                    {Object.keys(ranged_weapons).map((weapon) => (
                        <option key={weapon} value={weapon}>{weapon}</option>
                    ))}
                </select><br/>
                <select style={{ float: 'right' }} name="offHand" value={formData.offHand} onChange={handleChange}>
                    <option key="emptyOffhand" value="emptyHand">No weapon</option>
                    {Object.keys(weapons).map((weapon) => (
                        <option key={weapon} value={weapon}>{weapon}</option>
                    ))}
                </select><br/>
                <select style={{ float: 'right' }} name="offHandPistol" value={formData.offHandPistol} onChange={handleChange}>
                    <option key="emptyOffhand" value="emptyHand">No weapon</option>
                    {Object.keys(ranged_weapons).map((weapon) => (
                        <option key={weapon} value={weapon}>{weapon}</option>
                    ))}
                </select><br/>
                <input style={{ float: 'right' }} type="checkbox" name="charger" checked={formData.charger} onChange={handleChange} /><br/>
            </div>
        </div>
        <Accordion
            title="Combat skills"
        >
            <TagList
                tags={skills.filter((skill) => skill.category == 'combat')}
                formData={formData}
                handleTagChange={handleTagChange}
            />
        </Accordion>
        <Accordion
            title="Strength skills"
        >
            <TagList
                tags={skills.filter((skill) => skill.category == 'strength')}
                formData={formData}
                handleTagChange={handleTagChange}
            />
        </Accordion>
        <Accordion
            title="Speed skills"
        >
            <TagList
                tags={skills.filter((skill) => skill.category == 'speed')}
                formData={formData}
                handleTagChange={handleTagChange}
            />
        </Accordion>
        <Accordion title="Psychology" >
            <TagList
                tags={psychology}
                formData={formData}
                handleTagChange={handleTagChange}
            />
        </Accordion>
        <Accordion title="Abilities/Attributes">
            <TagList
                tags={abilities}
                formData={formData}
                handleTagChange={handleTagChange}
            />
        </Accordion>
      </form>
    );
};

export default WarriorComponent;