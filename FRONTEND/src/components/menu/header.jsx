import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSignOutAlt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import "./header.scss";

const Header = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://rolltales-api.onrender.com/profile",
          {
            withCredentials: true,
          }
        );
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Fermer le menu après navigation
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/login"); // Rediriger après la déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="header">
      <FontAwesomeIcon
        icon={isMenuOpen ? faXmark : faBars}
        className="burger-icon"
        onClick={toggleMenu}
      />
      <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        {isAdmin && (
          <button
            className="header-button"
            onClick={() => handleNavClick("/admin/dashboard")}
          >
            Dashboard
          </button>
        )}
        <button
          className="header-button"
          onClick={() => handleNavClick("/profile")}
        >
          Profil
        </button>
        <button
          className="header-button"
          onClick={() => handleNavClick("/create-campaign")}
        >
          Nouvelle campagne
        </button>
        <button
          className="header-button"
          onClick={() => handleNavClick("/create-character")}
        >
          Nouveau Personnage
        </button>
        <button
          className="header-button"
          onClick={() => handleNavClick("/admin/add-element")}
        >
          {isAdmin ? "Créer un élément" : "Voir les éléments"}
        </button>
        <button className="header-button logout" onClick={handleLogoutClick}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
        </button>
      </nav>
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;
