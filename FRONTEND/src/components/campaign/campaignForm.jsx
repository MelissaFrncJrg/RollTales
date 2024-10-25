import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDungeon,
  faEnvelope,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import { constForm, messageErrors } from "../../utils/regexValidation";
import { campaignService } from "../../services/campaignService";

import "./campaign-responsive.scss";
import "../../assets/styles/variables.scss";

const CampaignForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const { campaignId } = useParams(); // Utilisé pour l'édition

  const notification = useSelector((state) => state.notification);

  const [campaign, setCampaign] = useState({
    name: "",
    users: [],
  });

  // Charger les détails de la campagne si en mode édition
  useEffect(() => {
    if (campaignId && isEdit) {
      campaignService
        .getCampaignDetails(campaignId)
        .then((response) => {
          setCampaign(response);
          setInvitedUsers(response.users || []);
        })
        .catch((error) => {
          dispatch(
            setNotification({
              message: "Erreur lors de la récupération de la campagne",
              type: "error",
            })
          );
        });
    }
  }, [campaignId, isEdit, dispatch]);

  // Gestion des invitations utilisateurs
  const handleInviteUser = () => {
    if (userEmail !== "" && constForm.regexEmail.test(userEmail)) {
      setInvitedUsers((prev) => [...prev, userEmail]);
      setUserEmail("");
    }
  };

  const handleUserDeletion = (index) => {
    setInvitedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  // Soumission du formulaire de campagne
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (campaign.name.trim() === "") {
      dispatch(
        setNotification({
          message: "Veuillez entrer un nom de campagne !",
          type: "error",
        })
      );
      return;
    }

    try {
      let response;
      let newCampaignId = campaignId;

      if (isEdit) {
        // Appel au service pour mettre à jour la campagne
        response = await campaignService.updateCampaign(
          campaignId,
          campaign.name,
          invitedUsers
        );
        dispatch(
          setNotification({
            message: "Campagne mise à jour avec succès.",
            type: "success",
          })
        );
      } else {
        // Appel au service pour créer la campagne
        response = await campaignService.createCampaign(campaign.name);
        newCampaignId = response.campaignId; // Récupérer l'ID de la nouvelle campagne
        dispatch(
          setNotification({
            message: "Campagne créée avec succès.",
            type: "success",
          })
        );
      }

      // Appel au service pour envoyer les invitations
      for (const email of invitedUsers) {
        if (!campaign.users.includes(email)) {
          try {
            await campaignService.sendInvite(email, newCampaignId);
          } catch (error) {
            console.error(
              `Erreur lors de l'envoi de l'invitation à ${email}:`,
              error
            );
          }
        }
      }

      // Redirection après soumission
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/my-campaigns");
      }, 3000);
    } catch (error) {
      dispatch(
        setNotification({
          message: "Erreur lors de la soumission",
          type: "error",
        })
      );
    }
  };

  // Vider les champs après soumission
  const handleReset = (e) => {
    setCampaign({ ...campaign, name: e.target.value });
    setUserEmail("");
  };

  const handleCancel = () => {
    navigate("/my-campaigns");
  };

  // Désactiver le bouton de soumission si les champs requis ne sont pas remplis
  const disableSubmit = isEdit
    ? campaign.name.trim() === "" // En mode édition, seul le nom est requis
    : campaign.name.trim() === "" || invitedUsers.length === 0; // En mode création, nom et invités sont requis

  return (
    <div className="campaign container">
      <div className="form-header">
        <h1 className="campaign-header">
          {isEdit ? "Modifier la Campagne" : "Créer une Campagne"}
        </h1>
        <div className="underline"></div>
      </div>
      <div className="form">
        <FontAwesomeIcon icon={faDungeon} className="campaign-icon" />
        <input
          className="input"
          type="text"
          placeholder="Entrez un nom de Campagne"
          value={campaign.name}
          onChange={handleReset}
          required
        />
      </div>
      {campaign.name.trim() === "" && (
        <div className="error">{messageErrors.requiredField}</div>
      )}
      <div className="form">
        <FontAwesomeIcon icon={faEnvelope} className="campaign-icon" />
        <input
          className="input"
          type="email"
          placeholder="Inviter un Joueur"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faPlus}
          className="campaign-icon interactive"
          onClick={handleInviteUser}
        />
      </div>
      {userEmail.trim() !== "" && !constForm.regexEmail.test(userEmail) && (
        <p className="error">{messageErrors.regexEmail.error}</p>
      )}

      <div className="invited-players-section">Joueurs Invités :</div>
      <ul className="invited-users">
        {invitedUsers.map((user, index) => (
          <li key={index} className="invited-user">
            <span>{user}</span>
            <FontAwesomeIcon
              className="campaign-icon interactive fa-trash"
              icon={faTrash}
              onClick={() => handleUserDeletion(index)}
            />
          </li>
        ))}
      </ul>

      <div className="campaign-actions">
        <button
          className="submit btn"
          onClick={handleSubmit}
          disabled={disableSubmit}
        >
          {isEdit ? "Enregistrer les modifications" : "Créer une Campagne"}
        </button>
        <button className="cancel btn" onClick={handleCancel}>
          Annuler
        </button>
      </div>
      {notification.message && (
        <p className={notification.type === "error" ? "error" : "success"}>
          {notification.message}
        </p>
      )}
    </div>
  );
};

export default CampaignForm;
