import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CampaignForm from "./campaignForm";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSave = () => {
    // Afficher un message de succès si la campagne est modifiée
    dispatch(
      setNotification({
        message: "Campagne créée avec succès!",
        type: "success",
      })
    );

    // puis rediriger l'utilisateur vers la page des campagnes
    setTimeout(() => {
      dispatch(clearNotification());
      navigate("/my-campaigns");
    }, 2000);
  };

  const handleCancel = () => {
    // rediriger l'utilisateur vers la page des campagnes s'il annule l'action
    navigate("/my-campaigns");
  };

  return <CampaignForm onSave={handleSave} onCancel={handleCancel} />;
};

export default CreateCampaign;
