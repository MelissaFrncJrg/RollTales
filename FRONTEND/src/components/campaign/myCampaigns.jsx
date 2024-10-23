import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignService } from "../../services/campaignService";
import Card from "../../common/cards/card";
import Modal from "../../common/modal/Modal";
import EditCampaign from "./editCampaign";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import "./campaign-responsive.scss";

const MyCampaigns = () => {
  const [campaignsCreated, setCampaignsCreated] = useState([]);
  const [campaignsJoined, setCampaignsJoined] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditCampaign, setShowEditCampaign] = useState(false);
  const [actionType, setActionType] = useState(null);

  const userId = useSelector((state) => state.user.userId);
  const userEmail = useSelector((state) => state.user.userEmail);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (userId && userEmail) {
        try {
          const campaigns = await campaignService.getUserCampaigns();

          // Séparer les campagnes créées par l'utilisateur
          const created = campaigns.filter((camp) => camp.player_id === userId);

          // Séparer les campagnes où l'utilisateur a été invité mais qu'il n'a pas créées
          const invited = campaigns.filter(
            (camp) =>
              camp.player_id !== userId && camp.users.includes(userEmail)
          );

          setCampaignsCreated(created);
          setCampaignsJoined(invited);
        } catch (error) {
          dispatch(
            setNotification({
              message: "Erreur lors de la récupération des campagnes",
              type: "error",
            })
          );
          setTimeout(() => {
            dispatch(clearNotification());
          }, 3000);
        }
      }
    };

    fetchCampaigns();
  }, [dispatch, userId, userEmail]);

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditCampaign(true);
  };

  const handleDeleteCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setActionType("delete");
    setShowModal(true);
  };

  const handleLeaveCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setActionType("leave");
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "delete") {
        await campaignService.deleteCampaign(selectedCampaign._id);
        setCampaignsCreated(
          campaignsCreated.filter((camp) => camp._id !== selectedCampaign._id)
        );
        dispatch(
          setNotification({
            message: "Campagne supprimée avec succès",
            type: "success",
          })
        );
      } else if (actionType === "leave") {
        await campaignService.leaveCampaign(selectedCampaign._id);
        setCampaignsJoined(
          campaignsJoined.filter((camp) => camp._id !== selectedCampaign._id)
        );
        dispatch(
          setNotification({
            message: "Vous avez quitté la campagne avec succès",
            type: "success",
          })
        );
      }
      setShowModal(false);
      setSelectedCampaign(null);
      setActionType(null);
    } catch (error) {
      dispatch(
        setNotification({
          message: `Erreur lors de l'action ${actionType}`,
          type: "error",
        })
      );
    }
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const cancelAction = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setActionType(null);
  };

  const saveCampaignChanges = (updatedCampaign) => {
    setCampaignsCreated((prevCampaignsCreated) =>
      prevCampaignsCreated.map((camp) =>
        camp._id === updatedCampaign._id ? updatedCampaign : camp
      )
    );

    setShowEditCampaign(false);
    setSelectedCampaign(null);
    setActionType(null);

    dispatch(
      setNotification({
        message: "Modifications enregistrées avec succès",
        type: "success",
      })
    );
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <div className="campaign container">
      {showEditCampaign && selectedCampaign ? (
        <EditCampaign
          campaign={selectedCampaign}
          onSave={saveCampaignChanges}
          onCancel={() => setShowEditCampaign(false)}
        />
      ) : (
        <div>
          <h1>Mes Campagnes</h1>
          <div className="underline"></div>
          {notification.message && (
            <div>
              <p
                className={`notification ${
                  notification.type === "error" ? "error" : "success"
                }`}
              >
                {notification.message}
              </p>
            </div>
          )}

          <h2 className="campaign-subtitle">Campagnes Créées</h2>
          <div className="section">
            {campaignsCreated.length === 0 ? (
              <p>Vous n'avez pas encore créé de campagne.</p>
            ) : (
              <div className="cards-grid">
                {campaignsCreated.map((campaign) => (
                  <Card key={campaign._id} title={campaign.name}>
                    <div className="campaign-actions">
                      <button
                        className="submit btn"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        Modifier
                      </button>
                      <button
                        className="cancel btn"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <h2 className="campaign-subtitle">Campagnes rejointes</h2>
          <div className="section">
            {campaignsJoined.length === 0 ? (
              <p>Vous n'avez pas encore rejoint de campagnes.</p>
            ) : (
              <div className="cards-grid">
                {campaignsJoined.map((campaign) => (
                  <Card key={campaign._id} title={campaign.name}>
                    <div className="campaign-actions">
                      <button
                        className="cancel btn"
                        onClick={() => handleLeaveCampaign(campaign)}
                      >
                        Quitter
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {showModal && (
            <Modal
              title={
                actionType === "delete"
                  ? "Supprimer la campagne"
                  : "Quitter la campagne"
              }
              content={`Êtes-vous sûr de vouloir ${
                actionType === "delete" ? "supprimer" : "quitter"
              } la campagne ${selectedCampaign?.name} ?`}
              onConfirm={confirmAction}
              onCancel={cancelAction}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;
