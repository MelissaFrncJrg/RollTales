import React, { useState } from "react";
import axios from "axios";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { togglePassword } from "../../utils/togglePassword";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import { validatePassword, messageErrors } from "../../utils/regexValidation";

import "./reset-password-responsive.scss";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [hidePasswords, setHidePasswords] = useState([true, true]);
  const { token } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!token) {
      setInfoMessage("error token");
      setMessageType("error");
      return;
    }

    // on vérifie le format du mot de passe
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setInfoMessage(validationError);
      setMessageType("error");
      return;
    }
    // et si les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setInfoMessage(messageErrors.samePassword.error);
      setMessageType("error");
      return;
    }

    // requête à l'API pour reset le mot de passe
    try {
      await axios.post(
        "https://rolltales-api.onrender.com/reset-password",
        { token, newPassword },
        { withCredentials: true }
      );

      dispatch(
        setNotification({
          message:
            "Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/login");
      }, 3000);
    } catch (error) {
      dispatch(
        setNotification({
          message:
            "Une erreur est survenue lors de la mise à jour du mot de passe.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="reset-password container">
      <div className="reset-password-header">
        <h1>Réinitialiser le mot de passe</h1>
        <div className="underline"></div>
      </div>
      <div className="form">
        <input
          type={hidePasswords[0] ? "password" : "text"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`input ${newPassword ? "has-content" : ""}`}
        />
        <FontAwesomeIcon icon={faLock} className="input-icon" />
        <label className={`label ${newPassword ? "active" : ""}`}>
          Nouveau mot de passe
        </label>

        <FontAwesomeIcon
          icon={hidePasswords[0] ? faEye : faEyeSlash}
          className="icon-interactive"
          onClick={() => togglePassword(setHidePasswords, 0)}
        />
      </div>
      <div className="form">
        <input
          type={hidePasswords[1] ? "password" : "text"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`input ${confirmPassword ? "has-content" : ""}`}
        />
        <label className={`label ${confirmPassword ? "active" : ""}`}>
          Confirmation
        </label>

        <FontAwesomeIcon icon={faLock} className="input-icon" />

        <FontAwesomeIcon
          icon={hidePasswords[1] ? faEye : faEyeSlash}
          className="icon-interactive "
          onClick={() => togglePassword(setHidePasswords, 1)}
        />
      </div>
      <div className="reset-actions">
        <button className="submit btn" onClick={handlePasswordReset}>
          Réinitialiser le mot de passe
        </button>
      </div>
      {infoMessage && (
        <p className={messageType === "error" ? "error" : "success"}>
          {infoMessage}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
