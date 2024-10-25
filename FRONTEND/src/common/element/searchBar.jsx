import React from "react";

const SearchBar = ({ searchOption, setSearchOption }) => {
  const handleInputChange = (e) => {
    setSearchOption(e.target.value);
  };

  return (
    <input
      className="input"
      type="text"
      placeholder="Rechercher un élément..."
      value={searchOption}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
