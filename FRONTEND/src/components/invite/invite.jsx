import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import axios from "axios";
import Modal from "../../common/modal/Modal";
import { campaignService } from "../../services/campaignService";

const Invite = () => {
  const [campaignName, setCampaignName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const inviteToken = params.get("inviteToken");

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/campaign/${inviteToken}`,
          {
            withCredentials: true,
          }
        );
        setCampaignName(response.data.name);
      } catch (error) {
        dispatch(
          setNotification({
            message: "Les données de la campagne n'ont pas pu être récupérées.",
            type: "error",
          })
        );
        setTimeout(() => dispatch(clearNotification()), 5000);
        navigate("/my-campaigns");
      }
    };

    fetchCampaignDetails();
  }, [inviteToken, navigate, location.pathname, location.search, dispatch]);

  const handleInviteAcceptance = async () => {
    try {
      const response = await campaignService.acceptInvite(inviteToken);

      // Vérification correcte du message de succès
      if (response?.message === "Vous avez rejoint la campagne.") {
        // Redirection après succès
        dispatch(
          setNotification({
            message: `Vous avez rejoint la campagne ${campaignName}.`,
            type: "success",
          })
        );

        // Court délai avant la redirection pour laisser le message s'afficher
        setTimeout(() => {
          dispatch(clearNotification());
          navigate("/my-campaigns");
        }, 2000);
      } else {
        // Si la réponse n'est pas un succès, on affiche une erreur
        dispatch(
          setNotification({
            message: response?.message || "Une erreur est survenue.",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error(
        "Erreur dans le bloc catch de handleInviteAcceptance:",
        error
      );
      dispatch(
        setNotification({
          message:
            "Une erreur est survenue lors de l'acceptation de l'invitation.",
          type: "error",
        })
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  const handleInviteDecline = () => {
    navigate("/my-campaigns");
  };

  return (
    <div>
      <Modal
        title={`Rejoint la campagne ${campaignName}`}
        content={`Tu as été invité à rejoindre la campagne ${campaignName} !`}
        onConfirm={handleInviteAcceptance}
        onCancel={handleInviteDecline}
        acceptText="Rejoindre"
        declineText="Non merci"
      />
    </div>
  );
};

export default Invite;
