import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";

import Toggle from "../toggle/Toggle";

import "./origin-form.scss";
import { originService } from "../../services/originService";

const OriginForm = ({ editOrigin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { originId } = useParams(); // récupération de l'ID de ml'origine dans m'URL

  // obtenir l'état des notifications
  const notification = useSelector((state) => state.notification);

  // état local pour stocker les données de l'origine
  const [origin, setOrigin] = useState({
    name: "",
    description: "",
    allowsMagic: false,
    statsLimits: {
      courage: { min: 0, max: 0 },
      intelligence: { min: 0, max: 0 },
      charisme: { min: 0, max: 0 },
      adresse: { min: 0, max: 0 },
      force: { min: 0, max: 0 },
    },
    maxNaturalPR: 0,
    initialHealthPoints: 0,
    equipmentRestrictions: {
      maxArmorPR: 0,
      maxCarriedWeight: 0,
      allowedWeapons: [],
      disallowedArmor: [],
    },
    innateAbilities: {
      nyctalopia: false,
      dangerSensing: false,
      bothHands: false,
      can_use_shield: false,
    },
    specialNotes: "",
    skillsStart: [],
  });

  // exécution au montage du composanrt
  useEffect(() => {
    if (editOrigin) {
      // si l'action d'édition est choisie, on initialise l'état avec cette origine
      setOrigin(editOrigin);
    } else if (originId) {
      // si un ID d'origine est trouvé dans l'URL, on récupère l'origine correspondnate depuis le backend
      originService
        .getOriginById(originId)
        .then((response) => setOrigin(response)) // on met à jour l'état avec les données de la réponse
        .catch(() => {
          // en cas d'erreur on affiche une notification
          dispatch(
            setNotification({
              message: "Erreur lors de la récupération de l'origine",
              type: "error",
            })
          );
        });
    }
  }, [editOrigin, originId, dispatch]); // si ces valeurs changent, le useEffect se relance et remonte le composant

  // gére les modifications des champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // mise à jour du sous-objet si ces valeurs sont concernées
    if (["maxArmorPR", "maxCarriedWeight"].includes(name)) {
      setOrigin((prevState) => ({
        ...prevState,
        equipmentRestrictions: {
          ...prevState.equipmentRestrictions,
          [name]: Number(value),
        },
      }));
    } else {
      // pour les champs classiques on met à jour l'état de base
      setOrigin({ ...origin, [name]: value });
    }
  };

  const handleStatsChange = (e, statName, limitType) => {
    const value =
      e.target.value === "" ? null : Math.max(0, Number(e.target.value)); // on s'assure que la valeur ne puisse pas être négative
    setOrigin((prevState) => ({
      ...prevState,
      statsLimits: {
        ...(prevState.statsLimits || {}),
        [statName]: {
          ...(prevState.statsLimits?.[statName] || { min: 0, max: 0 }),
          [limitType]: value, // on met à jour la limite
        },
      },
    }));
  };

  // Gérer les toggles généraux comme allowsMagic
  const handleToggle = (value, key) => {
    // Scinder la chaîne en tableau de clés
    const keys = key.split(".");

    // Créer une copie de l'état `origin`
    const updatedOrigin = { ...origin };
    let current = updatedOrigin;

    // Parcourir les clés sauf la dernière
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];

      // Créer une copie de l'objet à chaque niveau pour préserver l'immuabilité
      current[k] = { ...current[k] };
      current = current[k];
    }

    // Mettre à jour la dernière clé avec la nouvelle valeur
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    // Mettre à jour l'état avec la nouvelle version immuable
    setOrigin(updatedOrigin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page lors de la soumission
    const originData = origin;
    // vérification des champs obligatoires
    if (!origin.name || origin.initialHealthPoints <= 0) {
      // on affiche une mnotification si ils sont manquants
      dispatch(
        setNotification({
          message: "Tous les champs marqués d'un * doivent être remplis",
          type: "error",
        })
      );
      return; // Arrêt de la soumission si les champs obligatoires ne sont pas remplis
    }

    try {
      await originService.creatOrUpdateOrigin(
        originData,
        originId || origin._id
      );
      dispatch(
        setNotification({
          message: "Formulaire soumis avec succès!",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        // on redirige l'utilisateur vers la liste des origines
        navigate("/origins");
      }, 3000);
    } catch (error) {
      dispatch(
        setNotification({
          message: "Erreur lors de la soumission",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="container">
      <div>
        <h1>
          {editOrigin || originId ? "Editer une origine" : "Créer une origine"}
        </h1>
        <div className="underline"></div>

        <div />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <h3>Caractéristiques générales</h3>
          <div className="underline"></div>

          {notification.message && (
            <p className={notification.type === "error" ? "error" : "success"}>
              {notification.message}
            </p>
          )}

          <div className="general-group">
            <h4>Nom de l'origine *</h4>
            <input
              className="input"
              type="text"
              name="name"
              value={origin.name}
              onChange={handleChange}
            />

            <h4>Description</h4>
            <textarea
              className="input"
              name="description"
              value={origin.description}
              onChange={handleChange}
            />

            <div className="actions">
              <Toggle
                setTrueFalse={(value) => handleToggle(value, "allowsMagic")}
                choices={["Non", "Oui"]}
                title="Peut utiliser la magie"
                checked={origin.allowsMagic}
                id={"allowsMagicToggle"}
              />
            </div>
          </div>
        </div>
        <div className="statistics-form">
          <h3>Statistiques</h3>
          <div className="underline"></div>

          {["courage", "intelligence", "charisme", "adresse", "force"].map(
            (stat) => (
              <div className="stat-group" key={stat}>
                <p>{stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
                <div>
                  <input
                    type="number"
                    name={`min${stat}`}
                    min="0"
                    placeholder="Min"
                    value={
                      origin.statsLimits[stat].min !== null &&
                      origin.statsLimits[stat].min !== 0
                        ? origin.statsLimits[stat].min
                        : ""
                    }
                    onChange={(e) => handleStatsChange(e, stat, "min")}
                  />
                  <input
                    type="number"
                    name={`max${stat}`}
                    max="9999"
                    placeholder="Max"
                    value={
                      origin.statsLimits[stat].max !== null &&
                      origin.statsLimits[stat].max !== 0
                        ? origin.statsLimits[stat].max
                        : ""
                    }
                    onChange={(e) => handleStatsChange(e, stat, "max")}
                  />
                </div>
              </div>
            )
          )}

          <h4>Protection naturelle maximale</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="maxNaturalPR"
            value={origin.maxNaturalPR}
            onChange={handleChange}
          />

          <h4>Points de vie initiaux *</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="initialHealthPoints"
            value={origin.initialHealthPoints}
            onChange={handleChange}
          />
        </div>

        <div className="restrictions-section">
          <h3>Restrictions d'équipement</h3>
          <div className="underline"></div>

          <h4> Protection maximale d'armure (PR)</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="maxArmorPR"
            value={origin.equipmentRestrictions.maxArmorPR}
            onChange={handleChange}
          />

          <h4> Poids maximal transporté</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="maxCarriedWeight"
            value={origin.equipmentRestrictions.maxCarriedWeight}
            onChange={handleChange}
          />

          <h4>Armes autorisées</h4>
          <input
            className="input"
            type="text"
            placeholder="Nom de l'arme ..."
            name="allowedWeapons"
            value={origin.equipmentRestrictions.allowedWeapons}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "allowedWeapons",
                  value: e.target.value.split(","),
                },
              })
            }
          />

          <h4>Armures interdites</h4>
          <input
            className="input"
            type="text"
            placeholder="Nom de l'armure ..."
            name="disallowedArmor"
            value={origin.equipmentRestrictions.disallowedArmor}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "disallowedArmor",
                  value: e.target.value.split(","),
                },
              })
            }
          />
        </div>

        <div className="abilities-section">
          <h3>Capacités innées</h3>
          <div className="underline"></div>

          <div className="actions">
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.nyctalopia")
              }
              choices={["Non", "Oui"]}
              title="Nyctalopie"
              checked={origin.innateAbilities.nyctalopia}
              id={"nyctalopiaToggle"}
            />
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.dangerSensing")
              }
              choices={["Non", "Oui"]}
              title="Sens du danger"
              checked={origin.innateAbilities.dangerSensing}
              id={"dangerSensingToggle"}
            />
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.bothHands")
              }
              choices={["Non", "Oui"]}
              title="Peut utiliser ses deux mains"
              checked={origin.innateAbilities.bothHands}
              id={"handToggle"}
            />
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.can_use_shield")
              }
              choices={["Non", "Oui"]}
              title="Peut utiliser un bouclier"
              checked={origin.innateAbilities.can_use_shield}
              id={"shieldToggle"}
            />
          </div>
        </div>
        <div className="notes-section">
          <h3>Notes spéciales</h3>
          <textarea
            className="input"
            name="specialNotes"
            value={origin.specialNotes}
            onChange={handleChange}
          />
        </div>
        <div className="actions-section">
          <button className="submit btn">
            {editOrigin || originId ? "Mettre à jour" : "Créer l'origine"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OriginForm;
