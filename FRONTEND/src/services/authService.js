import axios from "axios";

const API_URL = "https://rolltales-api.onrender.com";

const AuthService = {
  // Connexion de l'utilisateur
  login: async (userCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userCredentials, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.message || "Erreur lors de la connexion."
      );
    }
  },

  // Enregistrement de l'utilisateur
  register: async (data) => {
    const response = await axios.post(`${API_URL}/signup`, data, {
      withCredentials: true,
    });

    return response.data;
  },

  // Récupérer les données du profil utilisateur
  getUserData: async () => {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response;
  },

  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      // Appeler l'API de déconnexion sur le serveur
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/request-password-reset`,
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      throw (
        error.response?.data ||
        "Erreur lors de la réinitialisation du mot de passe."
      );
    }
  },
};

export default AuthService;
