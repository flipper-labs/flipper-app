import React, { useState } from 'react';

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-menu">
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ccc',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Open Dropdown
      </button>
      {isOpen && (
        <div
          className="dropdown-content"
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#f9f9f9',
            padding: '0.5rem',
          }}
        >
          <a href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Item 1
          </a>
          <a href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Item 2
          </a>
          <a href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Item 3
          </a>
        </div>
      )}
    </div>
  );
};
