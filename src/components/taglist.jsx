/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const TagList = ({ tags, formData, handleTagChange }) => {
    return (
        tags.map(tag => (
            <div
                key={tag.name}
                style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}
            >
            <div style={{ textAlign: 'left', position: 'relative' }}>
                <label
                    htmlFor={`tag-${tag.name}`}
                    style={{ cursor: tag.tooltip ? 'help' : 'default', position: 'relative' }}
                    onMouseEnter={e => {
                        if (tag.tooltip) {
                            const tooltip = document.createElement('div');
                            tooltip.innerText = tag.tooltip;
                            tooltip.style.position = 'absolute';
                            tooltip.style.left = '100%';
                            tooltip.style.top = '0';
                            tooltip.style.background = '#555';
                            tooltip.style.color = '#fff';
                            tooltip.style.borderColor = '#fff';
                            tooltip.style.padding = '4px 8px';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.border = '1px';
                            tooltip.style.whiteSpace = 'pre-line';
                            tooltip.style.zIndex = 1000;
                            tooltip.style.maxWidth = '320px';
                            tooltip.style.minWidth = '200px';
                            tooltip.className = 'psychology-tooltip';
                            e.target.appendChild(tooltip);
                        }
                    }}
                    onMouseLeave={e => {
                        const tooltip = e.target.querySelector('.psychology-tooltip');
                        if (tooltip) e.target.removeChild(tooltip);
                    }}
                >
                    {tag.label}
                    {tag.disabled && " (not implemented yet)"}
                </label>
            </div>
            <div>
                <input
                    type="checkbox"
                    name={tag.name}
                    checked={formData.tags.includes(tag.name)}
                    onChange={handleTagChange}
                    id={`tag-${tag.name}`}
                    style={{ float: 'right' }}
                    disabled={tag.disabled || false}
                />
            </div>
        </div>
        ))
    );
};

export default TagList;