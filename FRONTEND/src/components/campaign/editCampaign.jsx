import React from "react";
import CampaignForm from "./campaignForm";

const EditCampaign = ({ campaign, onSave, onCancel }) => {
  return (
    <CampaignForm
      campaign={campaign}
      isEdit={true}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default EditCampaign;
