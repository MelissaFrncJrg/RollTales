import axios from "axios";

const API_URL = "https://rolltales-api.onrender.com";

export const originService = {
  creatOrUpdateOrigin: async (originData, originId = null) => {
    try {
      if (originId) {
        axios.put(`${API_URL}/origins/${originId}`, originData, {
          withCredentials: true,
        });
      } else {
        axios.post(`${API_URL}/origins`, originData, {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.log("Erreur lors de la soumission de l'origine", error);
    }
  },

  fetchOrigins: async () => {
    try {
      const response = await axios.get(`${API_URL}/origins`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des origines :", error);
    }
  },

  getOriginById: async (originId) => {
    try {
      const response = axios.get(`${API_URL}/origins/${originId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("Erreur lors de la récupération de l'origine");
    }
  },

  deleteOrigin: async (originId) => {
    try {
      await axios.delete(`${API_URL}/origin/${originId}`, {
        withCredentials: true,
      });
    } catch (err) {
      throw new Error("Erreur lors de la suppression de l'origine");
    }
  },
};
