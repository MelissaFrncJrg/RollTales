import axios from "axios";

const API_URL = "https://rolltales-api.onrender.com";

export const professionService = {
  createOrUpdateProfession: async (professionData, professionId = null) => {
    try {
      if (professionId) {
        axios.put(`${API_URL}/professions/${professionId}`, professionData, {
          withCredentials: true,
        });
      } else {
        axios.post(`${API_URL}/professions`, professionData, {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.log("Erreur lors de la soumission du métier", error);
    }
  },

  fetchProfessions: async () => {
    try {
      const response = await axios.get(`${API_URL}/professions`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des métiers :", error);
    }
  },

  getProfessionById: async (professionId) => {
    try {
      const response = await axios.get(
        `${API_URL}/professions/${professionId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Erreur lors de la récupération du métier");
    }
  },

  deleteProfession: async (professionId) => {
    try {
      await axios.delete(`${API_URL}/professions/${professionId}`, {
        withCredentials: true,
      });
    } catch (err) {
      throw new Error("Erreur lors de la suppression du métier");
    }
  },
};
