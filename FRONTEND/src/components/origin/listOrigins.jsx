import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { originService } from "../../services/originService";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import Card from "../../common/cards/card";
import Modal from "../../common/modal/Modal";

import "./list-origins.scss";

const OriginList = ({ isAdmin }) => {
  const [origins, setOrigins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [originToDelete, setOriginToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fonction pour récupérer les origines
    const getOriginsList = async () => {
      try {
        const response = await originService.fetchOrigins();
        setOrigins(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des origines :", error);
      }
    };
    getOriginsList();
  }, []);

  // Fonction pour gérer la suppression d'une origine (admin)
  const handleDelete = async (originId) => {
    try {
      await originService.deleteOrigin(originId);
      setOriginToDelete(origins.filter((originId) => origin._id !== originId));

      dispatch(
        setNotification({
          message: "Origine supprimée avec succès.",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/origins");
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'origine :", error);
      dispatch(
        setNotification({
          message: "Erreur lors de la suppression de l'origine.",
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
  const confirmDelete = (origin) => {
    setOriginToDelete(origin);
    setShowModal(true);
  };

  // Fonction pour rediriger vers la page d'édition d'une origine (admin)
  const handleEdit = (originId) => {
    navigate(`/admin/edit-origin/${originId}`);
  };

  return (
    <div>
      <div className="grid-header">
        <h2>{isAdmin ? "Gestion des origines" : "Liste des origines"}</h2>
        <div className="underline"></div>
      </div>
      <div className="cards-grid">
        {origins.map((origin) => (
          <Card
            key={origin._id}
            title={origin.name}
            onClick={() => !isAdmin && navigate(`origins/${origin._id}`)}
          >
            <p
              className=""
              dangerouslySetInnerHTML={{ __html: origin.description }}
            ></p>
            {isAdmin && (
              <div className="card-actions">
                <button onClick={() => handleEdit(origin._id)}>Modifier</button>
                <button onClick={() => confirmDelete(origin)}>Supprimer</button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {showModal && originToDelete && (
        <Modal
          title="Confirmer la suppression"
          content={
            <p className="warning">
              Vous êtes sur le point d'effacer l'origine{" "}
              <strong>{originToDelete.name}</strong>. Les personnages l'ayant
              déjà équipée risquent de se retrouver à poil. Êtes-vous sûr de
              cette action ?
            </p>
          }
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => handleDelete(originToDelete._id)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OriginList;
