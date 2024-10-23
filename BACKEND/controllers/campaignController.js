import campaignService from "../services/campaignService.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mailService.js";
import Campaign from "../models/campaignModel.js";
import Invitation from "../models/invitationModel.js";
import { timeStamp } from "console";

export const createCampaign = async (req, res) => {
  const { name } = req.body;

  try {
    const newCampaign = new Campaign({
      name, // Le nom de la cmapagne
      player_id: req.user._id, // L'utilisateur actuellement connecté qui créé la campagne
      users: [], // Un tableau pour les joueurs invités
    });
    await newCampaign.save();

    res.status(201).json({
      message: "Campagne créée avec succès!",
      campaignId: newCampaign._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la création de la campagnes",
    });
  }
};

// Logique d'envoi des invitations
export const sendInvite = async (req, res) => {
  const { email, campaignId } = req.body;

  try {
    const campaign = await campaignService.getCampaignById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campagne non trouvée" });
    }

    if (campaign.users.includes(email)) {
      return res.status(400).json({
        message: "Cet utilisateur a déjà été invité.",
      });
    }

    // Générer un token JWT avec une durée de vie de 1 heure
    const inviteToken = jwt.sign(
      { email, campaignId, timeStamp: Date.now() },
      process.env.HASH_SECRET,
      { expiresIn: "1h" } // Le token lui-même expire en 1 heure
    );

    // Définir une date d'expiration dans 24 heures pour l'invitation
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Expiration dans 24 heures

    // Créer l'invitation et la sauvegarder dans la base de données
    const invitation = new Invitation({
      email,
      campaignId,
      token: inviteToken,
      expiryDate, // La date d'expiration stricte
    });

    await invitation.save();

    // Envoyer l'email avec le lien d'invitation
    await sendMail({
      to: email,
      subject: `Rejoignez la campagne "${campaign.name}"`,
      html: `<p>Vous avez été invité à rejoindre la campagne "${campaign.name}". Suivez <a href="https://roll-tales.netlify.app/signup?inviteToken=${inviteToken}">ce lien</a> pour accepter l'invitation.</p>`,
    });

    return res.status(200).json({ message: "Invitation envoyée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

export const invitationTokenInfo = async (req, res) => {
  const { token } = req.params;
  const campaigns = campaignService.getCampaignInvitation(token);
  return campaigns;
};

// Récupèrer une campagne par son ID
export const getCampaignDetails = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await campaignService.getCampaignById(campaignId);

    if (!campaign) {
      return res
        .status(404)
        .json({ message: "Aucune campagne n'a été trouvée" });
    }

    res.status(200).json({
      name: campaign.name,
      played_id: campaign.player_id,
      users: campaign.users,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des détails de la campagne",
    });
  }
};

// Acceptation d'invitation
export const acceptInvite = async (req, res) => {
  const { token } = req.body;

  try {
    // Trouver l'invitation en fonction du token
    const invitation = await Invitation.findOne({ token }).populate(
      "campaignId"
    );

    if (!invitation) {
      return res.status(404).json({ message: "Invitation non trouvée." });
    }

    // Vérifier si l'invitation a déjà été utilisée
    if (invitation.isUsed) {
      return res.status(400).json({ message: "Invitation déjà utilisée." });
    }

    // Vérifier si l'invitation a expiré
    const currentDate = new Date();
    if (currentDate > invitation.expiryDate) {
      return res.status(400).json({ message: "Invitation expirée." });
    }

    const userEmail = req.user.email;

    // Le token est valide, l'utilisateur peut rejoindre la campagne
    const campaign = await Campaign.findById(invitation.campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campagne non trouvée." });
    }

    // Vérifier si l'utilisateur a déjà rejoint la campagne
    if (campaign.users.includes(userEmail)) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà rejoint cette campagne !" });
    }

    // Ajouter l'utilisateur à la campagne
    campaign.users.push(userEmail);
    await campaign.save();

    // Marquer l'invitation comme utilisée
    invitation.isUsed = true;
    await invitation.save();

    res.status(200).json({ message: "Vous avez rejoint la campagne." });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des campagnes", error });
  }
};

export const updateCampaign = async (req, res) => {
  const { name, invitedUsers } = req.body;
  const { id } = req.params;

  try {
    const campaign = await campaignService.updateCampaign(id, {
      name,
      users: invitedUsers,
    });

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour de la campagne",
    });
  }
};

export const getUsersCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      $or: [
        { player_id: req.user._id }, // Campagnes créées par l'utilistauer
        { users: req.user.email }, // Campagnes auxquelles l'utilisateur a été invité
      ],
    });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({
      message:
        "Uner erreur est survenue lors de la récupération des campagnes.",
    });
  }
};

export const leaveCampaign = async (req, res) => {
  const { campaignId } = req.body;

  try {
    const campaign = await campaignService.getCampaignById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campagne non trouvée." });
    }

    // Supprimer l'eamil de  l'utilisateur des users de la campagne
    campaign.users = campaign.users.filter((email) => email !== req.user.email);
    await campaign.save();

    res.status(200).json({ message: "Vous avez quitté la campagne." });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de l'abandon de la campagne.",
    });
  }
};

export const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupèrer la campagne par son ID
    const campaign = await campaignService.getCampaignById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campagne non trouvée." });
    }

    // Vérifier si l'utilisateur est bien le créateur de la campagne
    if (campaign.player_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Non autorisé: vous ne pouvez supprimé que les campagnes que vous avez créées.",
      });
    }

    await Campaign.findByIdAndDelete(id);

    res.status(200).json({ message: "Campagne supprimée avec succès!" });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de la campagne.",
    });
  }
};
