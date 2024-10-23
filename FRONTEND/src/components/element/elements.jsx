import React, { useEffect, useState } from "react";
import axios from "axios";
import OriginForm from "../origin/originForm";
import OriginList from "../origin/listOrigins";
import ArmorForm from "../armor/armorForm";
import ArmorList from "../armor/armorList";

import "./elements.scss";

const AddElement = () => {
  const [selectedElement, setSelectedElement] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
        });
        setIsAdmin(response.data.isAdmin);
      } catch (err) {}
    };
    fetchUserData();
  }, []);

  const handleElementChange = (event) => {
    setSelectedElement(event.target.value);
  };

  const renderContent = () => {
    switch (selectedElement) {
      case "origin":
        return (
          <div>
            <OriginList isAdmin={isAdmin} />
            {isAdmin && <OriginForm />}
          </div>
        );
      case "armor":
        return (
          <div>
            <ArmorList isAdmin={isAdmin} />
            {isAdmin && <ArmorForm />}
          </div>
        );
      default:
        return <p>Sélectionnez un élément pour afficher son contenu.</p>;
    }
  };

  return (
    <div className="element container">
      <div>
        <h1> {isAdmin ? "Gérer les Éléments" : "Voir les Éléments"} </h1>
        <div className="select">
          <div className="select-box">
            <select
              className="dropdown"
              id="element-select"
              value={selectedElement}
              onChange={handleElementChange}
            >
              <option className="selector-option" value="">
                Choisis un élément
              </option>
              <option className="selector-option" value="origin">
                Origine
              </option>
              <option className="selector-option" value="armor">
                Armure ou équipement
              </option>
            </select>
          </div>
          <div className="elements-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AddElement;
