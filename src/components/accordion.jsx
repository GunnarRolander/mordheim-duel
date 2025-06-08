/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const Accordion = ({ title, children }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);
    return (
        <div style={{ marginBottom: '8px'}}>
            <div
                onClick={() => setAccordionOpen(!accordionOpen)}
                style={{
                    cursor: 'pointer',
                    padding: '0px 10px',
                    fontWeight: 'bold',
                    borderRadius: '4px 4px 0 0'
                }}
            >
                {title + (accordionOpen ? ' ▲' : ' ▼')}
            </div>
            {accordionOpen && <div>{children}</div>}
        </div>
    );
};

export default Accordion;