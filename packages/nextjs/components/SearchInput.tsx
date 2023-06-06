import React, { useState } from 'react';

export const SearchInput = (props: any) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    // Function to be called when the component loses focus
    console.log('Component blurred');
    props.setNameFilter(inputValue)
    // Perform any actions when the component loses focus here
  };

  return (
    <div>
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2 focus:outline-none"
        style={{backgroundColor: "#1E1E1E"}}
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
    </div>
  );
};
