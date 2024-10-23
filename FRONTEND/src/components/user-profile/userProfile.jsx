import React from "react";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookSkull,
  faCompass,
  faGhost,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";

import Card from "../../common/cards/card.jsx";

import "./profile-responsive.scss";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="profile container">
      <div className="profile-header">
        <h1>Profil utilisateur</h1>
        <div className="underline"></div>
      </div>
      <div className="cards-grid">
        <Card
          className="card"
          title="Editer le profil"
          onClick={handleEditProfile}
        >
          <FontAwesomeIcon
            className="card-icon"
            icon={faUserPen}
            alt="Editer le profil"
          />
        </Card>

        <Card title="Mes Campagnes" onClick={() => navigate("/my-campaigns")}>
          <FontAwesomeIcon
            className="card-icon"
            icon={faCompass}
            alt="Mes Campagnes"
          />
        </Card>
        <Card title="Mes Personnages" onClick={() => navigate("/myCharacters")}>
          <FontAwesomeIcon
            className="card-icon"
            icon={faGhost}
            alt="Mes Personnages"
          />
        </Card>
        <Card title="Éléments" onClick={() => navigate("/origins")}>
          <FontAwesomeIcon
            className="card-icon"
            icon={faBookSkull}
            alt="Éléments"
          />
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
