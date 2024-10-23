import axios from "axios";

const API_URL = "http://localhost:5000";

export const campaignService = {
  createCampaign: async (name) => {
    const response = await axios.post(
      `${API_URL}/campaign`,
      { name },
      { withCredentials: true }
    );

    return response.data;
  },

  updateCampaign: async (campaignId, name, invitedUsers) => {
    try {
      const response = await axios.put(
        `${API_URL}/campaign/${campaignId}`,
        { name, invitedUsers },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error("erreur lors de la mise à jour de la campagne");
    }
  },

  sendInvite: async (email, campaignId) => {
    try {
      await axios.post(
        `${API_URL}/sendInvite`,
        { email, campaignId },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      throw new Error("erreur lors de l'envoi de l'invitation");
    }
  },

  acceptInvite: async (inviteToken) => {
    const response = await axios.post(
      `${API_URL}/acceptInvite`,
      { token: inviteToken },
      { withCredentials: true }
    );
    return response.data;
  },

  getUserCampaigns: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-campaigns`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des campagnes");
    }
  },

  // Obtenir les détails d'une campagne
  getCampaignDetails: async (campaignId) => {
    const response = await axios.get(`${API_URL}/campaign/${campaignId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  deleteCampaign: async (campaignId) => {
    try {
      await axios.delete(`${API_URL}/campaign/${campaignId}`, {
        withCredentials: true,
      });
    } catch (err) {
      throw new Error("Erreur lors de la suppression de la campagne");
    }
  },

  leaveCampaign: async (campaignId) => {
    try {
      await axios.post(
        `${API_URL}/leaveCampaign`,
        { campaignId },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      throw new Error("Erreur lors de la modification de la campagne");
    }
  },
};
