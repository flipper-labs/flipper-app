import React, { useState } from "react";
import SearchIcon from "./../../public/svgs/search.svg";

export const SearchInput = (props: any) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    props.setNameFilter(inputValue);
  };

  return (
    <div className="flex flex-row items-center justify-start border-b border-gray-300 bg-dark-flipper-gray w-[15rem]">
      <SearchIcon stroke="#1e1e1e" />
      <input
        type="text"
        className="p-2 bg-transparent focus:outline-none"
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
    </div>
  );
};
