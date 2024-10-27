import React, { useState } from "react";
import OriginForm from "../../components/origin/originForm";
import ProfessionForm from "../../components/profession/professionForm";

import "./elements.scss";

const CreateElement = () => {
  const [selectedElement, setSelectedElement] = useState("");

  const handleElementChange = (event) => {
    setSelectedElement(event.target.value);
  };

  // Afficher le formulaire en fonction de l’élément sélectionné
  const renderForm = () => {
    switch (selectedElement) {
      case "origin":
        return <OriginForm />;
      case "profession":
        return <ProfessionForm />;
      default:
        return <p>Sélectionnez un élément à créer.</p>;
    }
  };

  return (
    <div className="container">
      <div className="grid-header">
        <h1>Créer un nouvel élément</h1>
        <div className="underline"></div>
      </div>
      <div className="select">
        <select
          className="dropdown"
          value={selectedElement}
          onChange={handleElementChange}
        >
          <option value="">Choisir un élément</option>
          <option value="origin">Origine</option>
          <option value="profession">Métier</option>
        </select>
      </div>
      <div>{renderForm()}</div>
    </div>
  );
};

export default CreateElement;
