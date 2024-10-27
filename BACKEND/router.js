import express from "express";
import {
  resetPassword,
  updatePassword,
  requestPasswordReset,
} from "./controllers/passwordController.js";
import {
  getUserProfile,
  updateUserProfile,
  deleUserAccount,
} from "./controllers/userController.js";
import {
  handleLogin,
  registerUser,
  handleLogout,
} from "./controllers/loginController.js";
import {
  sendInvite,
  acceptInvite,
  createCampaign,
  getUsersCampaigns,
  invitationTokenInfo,
  leaveCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignDetails,
} from "./controllers/campaignController.js";
import {
  createCharacter,
  getCharacters,
  getUserCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from "./controllers/characterController.js";
import {
  createArmor,
  getArmors,
  updateArmor,
  deleteArmor,
} from "./controllers/armorController.js";
import {
  createOrigin,
  getOrigins,
  updateOrigin,
  deleteOrigin,
  getOriginById,
} from "./controllers/originController.js";
import {
  createProfession,
  getProfessions,
  getProfessionById,
  updateProfession,
  deleteProfession,
} from "./controllers/professionController.js";
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "./controllers/skillController.js";
import {
  createWeapon,
  getWeapons,
  updateWeapon,
  deleteWeapon,
} from "./controllers/weaponController.js";

import isAdmin from "./middleware/isAdmin.js";
import verifyToken from "./middleware/verifyToken.js";

const router = express.Router();

// Routes publiques
router.post("/signup", registerUser);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/getInviteToken/:token", invitationTokenInfo);

// Routes accessibles aux utilisateurs connectés
router.use(verifyToken);

router.get("/profile", getUserProfile);
router.patch("/edit-profile", updateUserProfile);
router.delete("/delete-account", deleUserAccount);
router.post("/password", updatePassword);

// Gestion des personnages par les utilisateurs connectés
router.post("/characters", createCharacter);
router.get("/characters/user", getUserCharacters);
router.get("/characters/:id", getCharacterById);
router.patch("/characters/:id", updateCharacter);
router.delete("/characters/:id", deleteCharacter);

// Gestion des campagnes par les utilisateurs connectés
router.get("/my-campaigns", getUsersCampaigns);
router.post("/sendInvite", sendInvite);
router.post("/acceptInvite", acceptInvite);
router.get("/campaign/:id", getCampaignDetails);
router.post("/campaign", createCampaign);
router.post("/leaveCampaign", leaveCampaign);
router.patch("/campaign/:id", updateCampaign);
router.delete("/campaign/:id", deleteCampaign);

// Lister les objets pour les utilisateurs connectés
router.get("/origins", getOrigins);
router.get("/professions", getProfessions);
router.get("/armors", getArmors);

// Routes administrateur uniquement
router.use(isAdmin);

// router.post("/armors", createArmor);
// router.patch("/edit-armor/:id", updateArmor);
// router.delete("/armors/:id", deleteArmor);

router.post("/origins", createOrigin);
router.get("/origins", getOrigins);
router.get("/origins/:id", getOriginById);
router.patch("/origins/:id", updateOrigin);
router.delete("/origins/:id", deleteOrigin);

router.post("/professions", createProfession);
router.get("/professions", getProfessions);
router.get("/professions/:id", getProfessionById);
router.patch("/professions/:id", updateProfession);
router.delete("/professions/:id", deleteProfession);

router.post("/skills", createSkill);
router.get("/skills", getSkills);
router.patch("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

router.post("/weapons", createWeapon);
router.get("/weapons", getWeapons);
router.patch("/weapons/:id", updateWeapon);
router.delete("/weapons/:id", deleteWeapon);

// Gestion des erreurs pour les routes non trouvées
router.use((req, res) => {
  res.status(404).send("Page not found");
});

export default router;
