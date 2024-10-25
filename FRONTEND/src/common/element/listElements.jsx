import React, { useState } from "react";
import ArmorList from "../../components/armor/armorList";
import OriginList from "../../components/origin/listOrigins";
import ProfessionList from "../../components/profession/listProfessions";
import SearchBar from "./searchBar";

const ListElements = ({ isAdmin }) => {
  const [selectedElement, setSelectedElement] = useState("");
  const [searchOption, setSearchOption] = useState("");

  const handleElementChange = (event) => {
    setSelectedElement(event.target.value);
  };

  const renderList = () => {
    switch (selectedElement) {
      case "armor":
        return <ArmorList isAdmin={isAdmin} searchOption={searchOption} />;
      case "origin":
        return <OriginList isAdmin={isAdmin} searchOption={searchOption} />;
      case "profession":
        return <ProfessionList isAdmin={isAdmin} searchOption={searchOption} />;
      default:
        return;
    }
  };

  return (
    <div className="container">
      <div className="grid-header">
        <h1>Liste des éléments</h1>
        <div className="underline"></div>
      </div>
      <div className="select">
        <select
          className="dropdown"
          value={selectedElement}
          onChange={handleElementChange}
        >
          <option value="">Choisir un élément à lister</option>
          <option value="armor">Armure ou accessoire</option>
          <option value="origin">Origine</option>
          <option value="profession">Métier</option>
        </select>
      </div>
      <SearchBar
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />
      <div>{renderList()}</div>
    </div>
  );
};

export default ListElements;
