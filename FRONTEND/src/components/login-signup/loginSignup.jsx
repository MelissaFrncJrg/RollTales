import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

import AuthService from "../../services/authService";

import Modal from "../../common/modal/Modal";
import {
  validatePassword,
  messageErrors,
  constForm,
} from "../../utils/regexValidation";
import {
  faCompass,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useStyleInput from "../../utils/dynamicForm";

import "./login-signup-responsive.scss";
import { campaignService } from "../../services/campaignService";

const LoginSignup = ({ onLogin }) => {
  const [hidePasswords, setHidePasswords] = useState([true, true]);
  const [action, setAction] = useState("Connexion");
  const [campaignName, setCampaignName] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [inviteToken, setInviteToken] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [formData, handleChange, hasContent] = useStyleInput({
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
    campaignId: "",
    resetEmail: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("inviteToken");

    if (token) {
      setInviteToken(token); // Stocker le token dans l'état
      const decoded = jwtDecode(token);

      // mise à jour de l'état seulement si un changement des valeurs est détecté pour éviter les erreurs de mise à jour du composant
      if (decoded.email !== formData.email) {
        handleChange({
          target: { name: "email", value: decoded.email || "" },
        });
      }

      if (decoded.campaignId !== formData.campaignId) {
        handleChange({
          target: { name: "campaignId", value: decoded.campaignId || "" },
        });
      }
    }
  }, [location.search, handleChange]);

  const registerUser = async () => {
    try {
      const { pseudo, email, password, confirmPassword } = formData;

      if (!constForm.regexEmail.test(email)) {
        setInfoMessage(messageErrors.regexEmail.error);
        setMessageType("error");
        return;
      }

      const validationError = validatePassword(password);
      if (validationError) {
        setInfoMessage(validationError);
        setMessageType("error");
        return;
      }

      if (password !== confirmPassword) {
        setInfoMessage(messageErrors.samePassword.error);
        setMessageType("error");
        return;
      }

      // Utilisation du service backend
      const response = await AuthService.register({
        pseudo,
        email,
        password,
        password_confirm: confirmPassword,
      });

      if (!response) {
        throw new Error("Aucune donnée retournée par le serveur.");
      }

      const { userId, userEmail } = response;
      dispatch(setUser({ userId, userEmail }));

      if (onLogin) onLogin();

      if (inviteToken) {
        handleDisplayInviteModal();
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setInfoMessage(error.response?.data?.message || error.message);
      setMessageType("error");
    }
  };

  const handleLogin = async () => {
    try {
      const { email, password } = formData;

      if (!constForm.regexEmail.test(email)) {
        setInfoMessage(messageErrors.regexEmail.error);
        setMessageType("error");
        return;
      }

      // Appel du service de login
      const response = await AuthService.login({ email, password });

      // Vérification que la réponse contient bien des données
      if (!response?.userId) {
        throw new Error("Les informations utilisateur ne sont pas présentes.");
      }

      const { userId, userEmail, isAdmin } = response;

      // Mise à jour de l'état de l'utilisateur dans Redux
      dispatch(setUser({ userId, userEmail, isAdmin }));

      if (onLogin) {
        onLogin();
      }

      // Rediriger selon les droits de l'utilisateur
      if (inviteToken) {
        handleDisplayInviteModal();
      } else {
        navigate(isAdmin ? "/admin/dashboard" : "/profile");
      }
    } catch (error) {
      // Gestion des erreurs
      setInfoMessage(error.response?.data?.message || error.message);
      setMessageType("error");
    }
  };

  const handleDisplayInviteModal = async () => {
    if (inviteToken) {
      try {
        const decoded = jwtDecode(inviteToken);
        const response = await campaignService.getCampaignDetails(
          decoded.campaignId
        );

        if (response.users.includes(decoded.email)) {
          // Si l'utilisateur a déjà rejoint la campagne, ne pas ouvrir la modale
          setInfoMessage("Vous avez déjà rejoint cette campagne !");
          setMessageType("error");
          return;
        }

        setCampaignName(response.name);
        setIsInviteModalOpen(true);
      } catch (error) {
        setCampaignName("Campagne non trouvée");
        setIsInviteModalOpen(true); // Afficher la modale avec un nom par défaut en cas d'erreur de récupération
      }
    } else {
      console.log("aucun token d'invitation");
    }
  };

  const handleResetPasswordRequest = async () => {
    try {
      const { resetEmail } = formData;

      if (!constForm.regexEmail.test(resetEmail)) {
        setInfoMessage("Veuillez entrer un email valide.");
        setMessageType("error");
        return;
      }

      await AuthService.resetPassword(resetEmail.trim());
      setInfoMessage(
        "Lien de réinitialisation envoyé avec succès. Vérifiez vos spams"
      );
      setMessageType("success");
      setIsResetModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setInfoMessage("Aucun compte n'est lié à cet email");
      } else {
        setInfoMessage("Erreur lors de l'envoi de la requête");
      }
      setMessageType("error");
    }
  };

  return (
    <div className="login container">
      <form className="form">
        <div>
          <h1>{action}</h1>
          <div className="underline"></div>
        </div>
        <div className="action-login">
          <button
            className={
              action === "Créer un compte" ? "btn active" : "submit btn"
            }
            onClick={() => setAction("Créer un compte")}
            type="button"
          >
            Créer un compte
          </button>
          <button
            className={action === "Connexion" ? "btn active" : "submit btn"}
            onClick={() => setAction("Connexion")}
            type="button"
          >
            Connexion
          </button>
        </div>

        {action === "Créer un compte" && inviteToken && formData.campaignId && (
          <div className="form">
            <input
              type="text"
              name="campaignId"
              className={`input ${
                hasContent("campaignId") ? "has-content" : ""
              }`}
              value={formData.campaignId}
              onChange={handleChange}
              required
            />
            <label
              className={`label ${hasContent("campaignId") ? "active" : ""}`}
            >
              ID de campagne
            </label>
            <FontAwesomeIcon icon={faCompass} className="input-icon" />
          </div>
        )}

        {action === "Créer un compte" && (
          <div className="form">
            <input
              type="text"
              name="pseudo"
              maxLength={20}
              className={`input ${hasContent("pseudo") ? "has-content" : ""}`}
              value={formData.pseudo}
              onChange={handleChange}
              required
            />
            <label className={`label ${hasContent("pseudo") ? "active" : ""}`}>
              Pseudo
            </label>
            <FontAwesomeIcon icon={faUser} className="input-icon" />
          </div>
        )}

        <div className="form">
          <input
            type="email"
            name="email"
            className={`input ${hasContent("email") ? "has-content" : ""}`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label className={`label ${hasContent("email") ? "active" : ""}`}>
            Email
          </label>
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
        </div>

        <div className="form">
          <input
            type={hidePasswords[0] ? "password" : "text"}
            name="password"
            className={`input ${hasContent("password") ? "has-content" : ""}`}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className={`label ${hasContent("password") ? "active" : ""}`}>
            Mot de passe
          </label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <FontAwesomeIcon
            icon={hidePasswords[0] ? faEye : faEyeSlash}
            className="icon-interactive"
            onClick={() =>
              setHidePasswords([!hidePasswords[0], hidePasswords[1]])
            }
          />
        </div>

        {action === "Créer un compte" && (
          <div className="form">
            <input
              type={hidePasswords[1] ? "password" : "text"}
              name="confirmPassword"
              className={`input ${
                hasContent("confirmPassword") ? "has-content" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label
              className={`label ${
                hasContent("confirmPassword") ? "active" : ""
              }`}
            >
              Confirmation{" "}
            </label>
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <FontAwesomeIcon
              icon={hidePasswords[1] ? faEye : faEyeSlash}
              className="icon-interactive"
              onClick={() =>
                setHidePasswords([hidePasswords[0], !hidePasswords[1]])
              }
            />
          </div>
        )}

        {action === "Connexion" && (
          <button
            type="button"
            className="reset link-button"
            onClick={() => setIsResetModalOpen(true)}
          >
            Mot de passe oublié?
          </button>
        )}

        {infoMessage && (
          <p className={messageType === "error" ? "error" : "success"}>
            {infoMessage}
          </p>
        )}

        <button
          type="button"
          onClick={action === "Connexion" ? handleLogin : registerUser}
          className="submit btn"
        >
          {action === "Connexion" ? "Connexion" : "Créer un compte"}
        </button>
      </form>
      {isResetModalOpen && (
        <Modal
          title="Réinitialiser le mot de passe"
          onConfirm={handleResetPasswordRequest}
          onCancel={() => setIsResetModalOpen(false)}
          confirmText="Envoyer"
          cancelText="Annuler"
        >
          <div className="form">
            <label className="modal-label" htmlFor="resetEmail">
              Email
            </label>
            <input
              className="modal-input"
              type="email"
              id="resetEmail"
              name="resetEmail"
              value={formData.resetEmail}
              onChange={handleChange}
              required
            />
          </div>
        </Modal>
      )}
      {isInviteModalOpen && (
        <Modal
          title="Rejoindre la campagne"
          onConfirm={async () => {
            const response = await campaignService.acceptInvite(inviteToken);

            if (
              response?.message === "Vous avez déjà rejoint cette campagne !"
            ) {
              setInfoMessage(response?.message);
              setMessageType("error");
              return;
            }

            setInfoMessage(response?.message);
            setMessageType("success");
            setIsInviteModalOpen(false);

            setTimeout(() => {
              navigate("/my-campaigns");
            }, 2000);
          }}
          onCancel={() => setIsInviteModalOpen(false)}
          confirmText="Accepter"
          cancelText="Non merci"
        >
          <p className="modal-text">
            Vous avez été invité à rejoindre la campagne "{campaignName}".
            Voulez-vous accepter ?
          </p>
        </Modal>
      )}
    </div>
  );
};
export default LoginSignup;
