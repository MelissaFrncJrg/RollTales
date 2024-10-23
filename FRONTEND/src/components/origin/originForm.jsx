import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setNotification } from "../../redux/notificationSlice";

import Toggle from "../toggle/Toggle";

import "./origin-form.scss";

const OriginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // obtenir l'état des notifications
  const notification = useSelector((state) => state.notification);

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
      can_use_shield: null,
    },
    specialNotes: "",
    skillsStart: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["maxArmorPR", "maxCarriedWeight"].includes(name)) {
      setOrigin((prevState) => ({
        ...prevState,
        equipmentRestrictions: {
          ...prevState.equipmentRestrictions,
          [name]: Number(value),
        },
      }));
    } else {
      setOrigin({ ...origin, [name]: value });
    }
  };

  const handleStatsChange = (e, statName, limitType) => {
    const value = Math.max(0, Number(e.target.value));
    setOrigin((prevState) => ({
      ...prevState,
      statLimits: {
        ...prevState.statLimits,
        [statName]: {
          ...prevState.statLimits[statName],
          [limitType]: value,
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
    e.preventDefault();

    // vérification des champs obligatoires
    if (!origin.name || origin.initialHealthPoints <= 0) {
      dispatch(
        setNotification({
          message: "Tous les champs marqués d'un * doivent être remplis",
          type: "error",
        })
      );
      return; // Arrêt de la soumission si les champs obligatoires ne sont pas remplis
    }

    // const originData = origin;
    const token = localStorage.getItem("authToken");

    try {
      await axios.post("http://localhost:5000/origins", origin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate("/origins");
    } catch (error) {
      dispatch(
        setNotification({
          message: "Erreur lors de la création de l'origine",
          type: "error",
        })
      );
    }
  };

  return (
    <div>
      <div>
        <h1>Créer une origine</h1>
        <div className="underline"></div>

        <div />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <h3>Caractéristiques générales</h3>
          <div className="underline"></div>

          <label>
            <h4>Nom de l'origine *</h4>
            <input
              className="input"
              type="text"
              name="name"
              value={origin.name}
              onChange={handleChange}
            />
          </label>

          <label>
            <h4>Description</h4>
            <textarea
              name="description"
              value={origin.description}
              onChange={handleChange}
            />
          </label>

          <div>
            <Toggle
              setTrueFalse={(value) => handleToggle(value, "allowsMagic")}
              choices={[false, true]}
              title="Peut utiliser la magie"
              checked={origin.allowsMagic}
              id={"allowsMagicToggle"}
            />
          </div>
        </div>

        <div className="statistiques-form">
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
                    value={origin.statsLimits[stat].min}
                    onChange={(e) => handleStatsChange(e, stat, "min")}
                  />
                  <input
                    type="number"
                    name={`max${stat}`}
                    min="0"
                    placeholder="Max"
                    value={origin.statsLimits[stat].max}
                    onChange={(e) => handleStatsChange(e, stat, "max")}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <label>
          <h4>Protection naturelle maximale</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="maxNaturalPR"
            value={origin.maxNaturalPR}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>Points de vie initiaux *</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="initialHealthPoints"
            value={origin.initialHealthPoints}
            onChange={handleChange}
          />
        </label>

        <label>
          <h3>Restrictions d'équipement</h3>
          <div className="underline"></div>

          <div>
            <h4> Protection maximale d'armure (PR)</h4>
            <input
              className="input"
              type="number"
              min="0"
              name="maxArmorPR"
              value={origin.equipmentRestrictions.maxArmorPR}
              onChange={handleChange}
            />
          </div>

          <div>
            <h4> Poids maximal transporté</h4>
            <input
              className="input"
              type="number"
              min="0"
              name="maxCarriedWeight"
              value={origin.equipmentRestrictions.maxCarriedWeight}
              onChange={handleChange}
            />
          </div>
        </label>
        <div>
          <label>
            <h4>Armes autorisées</h4>
            <input
              className="input"
              type="text"
              placeholder="ID des armes séparés par des virgules"
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
          </label>

          <label>
            <h4>Armures interdites</h4>
            <input
              className="input"
              type="text"
              placeholder="ID des armures séparés par des virgules"
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
          </label>
        </div>

        <h3>Capacités innées</h3>
        <div className="underline"></div>

        <div>
          <div>
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.nyctalopia")
              }
              choices={[false, true]}
              title="Nyctalopie"
              checked={origin.innateAbilities.nyctalopia}
              id={"nyctalopiaToggle"}
            />
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.dangerSensing")
              }
              choices={[false, true]}
              title="Sens du danger"
              checked={origin.innateAbilities.dangerSensing}
              id={"dangerSensingToggle"}
            />
            <Toggle
              setTrueFalse={(value) =>
                handleToggle(value, "innateAbilities.can_use_shield")
              }
              choices={[false, true]}
              title="Peut utiliser un bouclier"
              checked={origin.innateAbilities.can_use_shield}
              id={"shieldToggle"}
            />
          </div>
        </div>
        <label>
          <p>Notes spéciales</p>
          <textarea
            name="specialNotes"
            value={origin.specialNotes}
            onChange={handleChange}
          />
        </label>

        {notification.message && (
          <p className={notification.type === "error" ? "error" : "success"}>
            {notification.message}
          </p>
        )}

        <button type="submit btn">Créer l'origine</button>
      </form>
    </div>
  );
};

export default OriginForm;
