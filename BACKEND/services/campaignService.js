import Campaign from "../models/campaignModel.js";

const campaignService = {
  // Créer un nouvele campagne
  createCampaign: async (campaignData) => {
    try {
      const campaign = new Campaign(campaignData);
      await campaign.save();
      return campaign;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir une campagne par son ID
  getCampaignById: async (campaignId) => {
    try {
      const campaign = await Campaign.findById(campaignId);
      return campaign;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une campagne
  updateCampaign: async (id, updateData) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return campaign;
    } catch (error) {
      throw error;
    }
  },

  // Inviter un joueur à rejoindre la campagne
  inviteUserToCampaign: async (campaignId, email) => {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign.users.includes(email)) {
        campaign.users.push(email);
        await campaign.save();
        return campaign;
      } else {
        throw new Error("Ce joueur a déjà été invité");
      }
    } catch (error) {
      throw error;
    }
  },

  // Trouver une campagne par créateur
  getCampaignByCreator: async (userId) => {
    try {
      const campaigns = await Campaign.find({ player_id: userId });
      return campaigns;
    } catch (error) {
      throw error;
    }
  },

  // Trouver une campagne par utilisateur
  getCampaignByUser: async (email) => {
    try {
      const campaigns = await Campaign.find({ users: email });
      return campaigns;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une campagne
  deleteCampaign: async (campaignId) => {
    try {
      const result = await Campaign.findByIdAndDelete(campaignId);
      return result;
    } catch (error) {
      throw error;
    }
  },

  addCampaignInvitation: async (email, campaignId, token) => {
    try {
      await Campaign.findByIdAndUpdate(campaignId, {
        $push: { invitation: { token, email, isActive: true } },
      });
    } catch (error) {
      throw error;
    }
  },

  getCampaignInvitation: async (token) => {
    try {
      const campaign = await Campaign.find({ invitation: { token: token } });
      return campaign;
    } catch (error) {
      throw error;
    }
  },
};

export default campaignService;
