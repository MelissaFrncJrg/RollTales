import axios from "axios";

const API_URL = "https://rolltales-api.onrender.com";

export const characterService = {
  // Créer ou mettre à jour un personnage
  createOrUpdateCharacter: async (characterData, characterId = null) => {
    try {
      if (characterId) {
        // Mise à jour d'un personnage existant
        await axios.patch(
          `${API_URL}/characters/${characterId}`,
          characterData,
          {
            withCredentials: true,
          }
        );
      } else {
        // Création d'un nouveau personnage
        await axios.post(`${API_URL}/characters`, characterData, {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création ou mise à jour du personnage service front:",
        error
      );
    }
  },

  // Récupérer tous les personnages
  fetchCharacters: async () => {
    try {
      const response = await axios.get(`${API_URL}/characters`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des personnages :", error);
    }
  },

  // Récupèrer les personnages de l'utilisateur
  fetchUserCharacters: async () => {
    try {
      const response = await axios.get(`${API_URL}/characters/user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {}
  },

  // Récupérer un personnage par son ID
  getCharacterById: async (characterId) => {
    try {
      const response = await axios.get(`${API_URL}/characters/${characterId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du personnage :", error);
    }
  },

  // Supprimer un personnage
  deleteCharacter: async (characterId) => {
    try {
      await axios.delete(`${API_URL}/characters/${characterId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du personnage:", error);
      throw new Error("Erreur lors de la suppression du personnage");
    }
  },
};

export default characterService;
