import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import Modal from "../../common/modal/Modal";

import "./list-origins.scss";

const OriginList = ({ isAdmin }) => {
  const [origins, setOrigins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [originToDelete, setOriginToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOrigins(); // Récupérer la liste des origines
  }, []);

  // Fonction pour récupérer les origines
  const fetchOrigins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/origins", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      setOrigins(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des origines :", error);
    }
  };

  // Fonction pour gérer la suppression d'une origine (admin)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/origins/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      setOrigins(origins.filter((origin) => origin._id !== id));

      dispatch(
        setNotification({
          message: "Origine supprimée avec succès.",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'origine :", error);
      dispatch(
        setNotification({
          message: "Erreur lors de la suppression de l'origine.",
          type: "error",
        })
      );
    }
    setShowModal(false);
  };

  // Fonction pour afficher une modale de confirmation avant suppression
  const confirmDelete = (origin) => {
    setOriginToDelete(origin);
    setShowModal(true);
  };

  // Fonction pour rediriger vers la page d'édition d'une origine (admin)
  const handleEdit = (id) => {
    navigate(`/admin/edit-origin/${id}`);
  };

  return (
    <div className="list">
      <h2>{isAdmin ? "Gestion des origines" : "Liste des origines"}</h2>
      <table className="element-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {origins.map((origin) => (
            <tr key={origin._id}>
              <td>{origin.name}</td>
              <td dangerouslySetInnerHTML={{ __html: origin.description }}></td>
              {/* Pour permettre un affichage correct de la description malgré le middleware en place */}
              {isAdmin && (
                <td>
                  <button onClick={() => handleEdit(origin._id)}>
                    Modifier
                  </button>
                  <button onClick={() => confirmDelete(origin)}>
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
          confirmText={<p className="btn danger">Supprimer</p>}
          cancelText={<p className="btn">Annuler</p>}
          onConfirm={() => handleDelete(originToDelete._id)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OriginList;
