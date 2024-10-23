import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { togglePassword } from "../../utils/togglePassword";
import { messageErrors, validatePassword } from "../../utils/regexValidation";
import {
  clearNotification,
  setNotification,
} from "../../redux/notificationSlice";

import Modal from "../../common/modal/Modal";
import "./profile-responsive.scss";
import AuthService from "../../services/authService";

const EditProfile = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hidePasswords, setHidePasswords] = useState([true, true, true]);

  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  // Fonction pour récupérer les données utilisateur actuelles
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Récupérer les données utilisateur via l'API
        const response = await AuthService.getUserData();

        // Assurer que pseudo et email ne soient jamais undefined
        setPseudo(response.data.pseudo || "");
        setEmail(response.data.userEmail || "");
      } catch (error) {
        // Dispatch une notification si nécessaire
        dispatch(
          setNotification({
            message: "Erreur lors de la récupération des données",
            type: "error",
          })
        );
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    let updates = {};

    // Vérifier si le pseudo a été modifié
    if (pseudo) {
      updates.pseudo = pseudo;
    }

    // Vérifier si l'email a été modifié
    if (email) {
      updates.email = email;
    }

    // Vérifier si le mot de passe a été modifié
    if (newPassword || confirmNewPassword || currentPassword) {
      if (!currentPassword) {
        dispatch(
          setNotification({
            message:
              "Vous devez entrer votre mot de passe actuel pour le modifier.",
            type: "error",
          })
        );
        return;
      }

      // Valider le nouveau mot de passe
      const validationError = validatePassword(newPassword);
      if (validationError) {
        setInfoMessage(validationError);
        setMessageType("error");
        return;
      }

      // Vérifier si les mots de passe correspondent
      if (newPassword !== confirmNewPassword) {
        setInfoMessage(messageErrors.samePassword.error);
        setMessageType("error");
        return;
      }

      // Vérifier si le nouveau mot de passe différe de l'ancien
      if (newPassword === currentPassword) {
        setInfoMessage(messageErrors.sameAsOldPassword.error);
        setMessageType("error");
        return;
      }

      updates.currentPassword = currentPassword;
      updates.newPassword = newPassword;
    }

    try {
      // Mise à jour des informations de profil

      await axios.put(
        "http://localhost:5000/edit-profile",
        { pseudo: updates.pseudo, email: updates.email },
        {
          withCredentials: true,
        }
      );

      // Mise à jour du mot de passe
      if (updates.currentPassword && updates.newPassword) {
        await axios.post(
          "http://localhost:5000/password",
          {
            currentPassword: updates.currentPassword,
            newPassword: updates.newPassword,
          },
          {
            withCredentials: true,
          }
        );
      }

      setInfoMessage("");
      setMessageType("");

      dispatch(
        setNotification({
          message: "Données mises à jour avec succès !",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
      }, 10000);
    } catch (error) {
      // Vérifier si l'erreur est due au mot de passe actuel incorrect
      if (error.response && error.response.status === 401) {
        setInfoMessage("Le mot de passe actuel est incorrect.");
        setMessageType("error");
      } else {
        setNotification({
          message: "Une erreur est survenue lors de la mise à jour du profil",
          type: "error",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/delete-account",
        {
          withCredentials: true,
        }
      );
      handleLogout();
      navigate("/signup");
    } catch (error) {
      dispatch(
        setNotification({
          message: "Une erreur est survenue lors de la suppression du compte",
          type: "error",
        })
      );
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="edit-form container">
        <div>
          <h1>Editer le profil</h1>
          <div className="underline"></div>
        </div>
        <form className="form" onSubmit={handleUpdateProfile}>
          <div className="form">
            <input
              type="text"
              className={`input ${pseudo ? "has-content" : ""}`}
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
            <label
              className={`label ${pseudo ? "active" : ""}`}
              htmlFor="pseudo"
            >
              Pseudo
            </label>
            <FontAwesomeIcon icon={faUser} className="input-icon" />
          </div>
          <div className="form">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${email ? "has-content" : ""}`}
            />
            <label className={`label ${email ? "active" : ""}`} htmlFor="email">
              Email
            </label>
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          </div>
          <div className="form">
            <input
              type={hidePasswords[0] ? "password" : "text"}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`input ${currentPassword ? "has-content" : ""}`}
            />

            <label
              className={`label ${currentPassword ? "active" : ""}`}
              htmlFor="currentPassword"
            >
              Mot de passe actuel
            </label>
            <FontAwesomeIcon icon={faLock} className="input-icon" />

            <FontAwesomeIcon
              icon={hidePasswords[0] ? faEye : faEyeSlash}
              className="icon-interactive"
              onClick={() => togglePassword(setHidePasswords, 0)}
            />
          </div>
          <div className="form">
            <input
              type={hidePasswords[1] ? "password" : "text"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`input ${newPassword ? "has-content" : ""}`}
            />
            <label
              className={`label ${newPassword ? "active" : ""}`}
              htmlFor="newPassword"
            >
              Nouveau mot de passe
            </label>
            <FontAwesomeIcon icon={faLock} className="input-icon" />

            <FontAwesomeIcon
              icon={hidePasswords[1] ? faEye : faEyeSlash}
              className="icon-interactive "
              onClick={() => togglePassword(setHidePasswords, 1)}
            />
          </div>
          <div className="form">
            <input
              type={hidePasswords[2] ? "password" : "text"}
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={`input ${confirmNewPassword ? "has-content" : ""}`}
            />
            <label
              className={`label ${confirmNewPassword ? "active" : ""}`}
              htmlFor="confirmNewPassword"
            >
              Confirmation
            </label>
            <FontAwesomeIcon icon={faLock} className="input-icon" />

            <FontAwesomeIcon
              icon={hidePasswords[2] ? faEye : faEyeSlash}
              className="icon-interactive "
              onClick={() => togglePassword(setHidePasswords, 2)}
            />
          </div>
          {notification.message && (
            <div>
              <p
                className={notification.type === "error" ? "error" : "success"}
              >
                {notification.message}
              </p>
            </div>
          )}

          {infoMessage && (
            <p
              className={`message ${
                messageType === "error" ? "error" : "success"
              }`}
            >
              {infoMessage}
            </p>
          )}
          <div className="profile-actions">
            <button className="submit btn" type="submit">
              Mettre à jour le profil
            </button>
            <button
              className="cancel btn"
              type="button"
              onClick={handleOpenModal}
            >
              Supprimer le compte
            </button>
          </div>
        </form>
      </div>

      {/* Modale de confirmation de suppression */}
      {isModalOpen && (
        <Modal
          title="Confirmation"
          content="Cette action supprimera définitivement votre compte. Êtes-vous sûr de vouloir continuer?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
          confirmText="Continuer"
          cancelText="Annuler"
        />
      )}
    </>
  );
};

export default EditProfile;
