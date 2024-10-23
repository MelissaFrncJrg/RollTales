import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDungeon,
  faEnvelope,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { constForm, messageErrors } from "../../utils/regexValidation";
import { campaignService } from "../../services/campaignService"; // Utilisation du service externe

import "./campaign-responsive.scss";
import "../../assets/styles/variables.scss";

const CampaignForm = ({ campaign = {}, isEdit = false, onSave, onCancel }) => {
  const [campaignName, setCampaignName] = useState(campaign.name || "");
  const [invitedUsers, setInvitedUsers] = useState(campaign.users || []);
  const [userEmail, setUserEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEdit) {
      setCampaignName(campaign.name);
      setInvitedUsers(campaign.users || []);
    }
  }, [campaign, isEdit]);

  const handleInviteUser = () => {
    if (userEmail !== "") {
      if (!constForm.regexEmail.test(userEmail)) {
        return;
      }
      setInvitedUsers((prev) => [...prev, userEmail]);
      setUserEmail("");
    }
  };

  const handleUserDeletion = (index) => {
    setInvitedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (campaignName.trim() === "") {
      return;
    }

    try {
      let updatedCampaign;

      if (isEdit) {
        // Appel au service pour mettre à jour la campagne
        updatedCampaign = await campaignService.updateCampaign(
          campaign._id,
          campaignName,
          invitedUsers
        );
        setSuccessMessage("Campagne mise à jour avec succès.");
      } else {
        // Appel au service pour créer la campagne
        const response = await campaignService.createCampaign(campaignName);
        updatedCampaign = { _id: response.campaignId, ...response };
        setSuccessMessage("La campagne a été créée avec succès.");
      }

      // Appel au service pour envoyer les invitations
      for (const email of invitedUsers) {
        if (!campaign.users || !campaign.users.includes(email)) {
          await campaignService.sendInvite(email, updatedCampaign._id);
        }
      }

      // Vider les champs après soumission
      setCampaignName("");
      setInvitedUsers([]);
      setUserEmail("");

      // Passer la campagne mise à jour pour rafraichir l'état
      onSave(updatedCampaign);
    } catch (error) {
      console.log("erreur lors de l'envoi des invitations:", error);
    }
  };

  const handleReset = (e) => {
    setCampaignName(e.target.value);
    setUserEmail("");
    setSuccessMessage("");
  };

  // Désactiver le bouton de soumission si les champs requis ne sont pas remplis
  const disableSubmit = isEdit
    ? campaignName.trim() === "" // En mode édition, seul le nom est requis
    : campaignName.trim() === "" || invitedUsers.length === 0; // En mode création, nom et invités sont requis

  return (
    <div className="campaign container">
      <div className="form-header">
        <h1 className="campaign-header">
          {isEdit ? "Modifier la Campagne" : "Créer une Campagne"}
        </h1>
        <div className="underline"></div>
      </div>
      <div className="campaign form">
        <FontAwesomeIcon icon={faDungeon} className="campaign-icon" />
        <input
          className="input"
          type="text"
          placeholder="Entrez un nom de Campagne"
          value={campaignName}
          onChange={handleReset}
          required
        />
      </div>
      {campaignName.trim() === "" && (
        <div className="error">{messageErrors.requiredField}</div>
      )}
      <div className="campaign form">
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

      <div className="campaign input">Joueurs Invités :</div>
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
        <button className="cancel btn" onClick={onCancel}>
          Annuler
        </button>
      </div>
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default CampaignForm;
