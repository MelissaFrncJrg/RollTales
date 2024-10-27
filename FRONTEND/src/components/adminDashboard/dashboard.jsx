import React from "react";
import Card from "../../common/cards/card.jsx";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faList } from "@fortawesome/free-solid-svg-icons";

import "./dashboard-responsive.scss";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddElement = () => {
    navigate("/admin/add-element");
  };

  const handleListElements = () => {
    navigate("/list-elements");
  };

  return (
    <div className="dashboard container">
      <div className="grid-header">
        <h1>Dashboard Administrateur</h1>
        <div className="underline"></div>
      </div>

      <div className="cards-grid">
        <Card
          className="card"
          onClick={handleAddElement}
          title={"Ajouter un élément"}
        >
          <FontAwesomeIcon
            className="card-icon"
            icon={faPlusCircle}
            alt="Ajouter un élément"
          />
        </Card>

        <Card
          className="card"
          onClick={handleListElements}
          title={"Liste des éléments"}
        >
          <FontAwesomeIcon
            className="card-icon"
            icon={faList}
            alt="Lister les éléments"
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
