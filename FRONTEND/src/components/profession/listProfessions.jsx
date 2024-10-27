import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { professionService } from "../../services/professionService";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import Card from "../../common/cards/card";
import Modal from "../../common/modal/Modal";

const ProfessionList = ({ isAdmin, searchOption = "" }) => {
  const [profession, setProfession] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [professionToDelete, setProfessionToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fonction pour récupérer les métiers
    const getProfessionsList = async () => {
      try {
        const response = await professionService.fetchProfessions();
        setProfession(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des métiers :", error);
      }
    };
    getProfessionsList();
  }, []);

  // Fonction pour gérer la suppression d'un métier (admin)
  const handleDelete = async (professionId) => {
    try {
      await professionService.deleteProfession(professionId);
      setProfessionToDelete(
        profession.filter((professionId) => profession._id !== professionId)
      );

      dispatch(
        setNotification({
          message: "Métier supprimé avec succès.",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/professions");
      }, 5000);
    } catch (error) {
      dispatch(
        setNotification({
          message: "Erreur lors de la suppression du métier.",
          type: "error",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
    }
    setShowModal(false);
  };

  // Fonction pour afficher une modale de confirmation avant suppression
  const confirmDelete = (profession) => {
    setProfessionToDelete(profession);
    setShowModal(true);
  };

  // Fonction pour rediriger vers la page d'édition d'un métier (admin)
  const handleEdit = (professionId) => {
    navigate(`/admin/edit-profession/${professionId}`);
  };

  // Barre de recherche
  const filteredProfessions = profession.filter((profession) =>
    profession.name.toLowerCase().includes(searchOption.toLowerCase())
  );

  return (
    <div className="container">
      <div className="grid-header">
        <h2>{isAdmin ? "Gestion des métiers" : "Liste des métiers"}</h2>
        <div className="underline"></div>
      </div>
      <div className="cards-grid">
        {filteredProfessions.map((profession) => (
          <Card
            key={profession._id}
            title={profession.name}
            onClick={() =>
              !isAdmin && navigate(`professions/${profession._id}`)
            }
          >
            {isAdmin && (
              <div className="card-actions">
                <button
                  className="submit btn"
                  onClick={() => handleEdit(profession._id)}
                >
                  Modifier
                </button>
                <button
                  className="cancel btn"
                  onClick={() => confirmDelete(profession)}
                >
                  Supprimer
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {showModal && professionToDelete && (
        <Modal
          title="Confirmer la suppression"
          content={
            <p className="warning">
              Vous êtes sur le point d'effacer le métier{" "}
              <strong>{professionToDelete.name}</strong>. Les personnages
              l'ayant choisi risquent de se retrouver sans métier! Êtes-vous sûr
              de cette action ?
            </p>
          }
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => handleDelete(professionToDelete._id)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProfessionList;
