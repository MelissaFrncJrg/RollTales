import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";

import { professionService } from "../../services/professionService";

const ProfessionForm = ({ editProfession }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { professionId } = useParams();

  const notification = useSelector((state) => state.notification);

  const [profession, setProfession] = useState({
    name: "",
    pv_init: 0,
    pr_nat_max: 0,
    statsLimits: {
      courage: { min: 0, max: 0 },
      intelligence: { min: 0, max: 0 },
      charisme: { min: 0, max: 0 },
      adresse: { min: 0, max: 0 },
      force: { min: 0, max: 0 },
    },
  });

  useEffect(() => {
    if (editProfession) {
      setProfession(editProfession);
    } else if (professionId) {
      professionService
        .getProfessionById(professionId)
        .then((response) => setProfession(response))
        .catch(() => {
          dispatch(
            setNotification({
              message: "Erreur lors de la récupération du métier",
              type: "error",
            })
          );
        });
    }
  }, [editProfession, professionId, dispatch]);

  // gére les modifications des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfession({ ...profession, [name]: value });
  };

  const handleStatsChange = (e, statName, limitType) => {
    const value =
      e.target.value === "" ? null : Math.max(0, Number(e.target.value));
    setProfession((prevState) => ({
      ...prevState,
      statsLimits: {
        ...(prevState.statsLimits || {}),
        [statName]: {
          ...(prevState.statsLimits?.[statName] || { min: 0, max: 0 }),
          [limitType]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const professionData = profession;
    if (!profession.name) {
      dispatch(
        setNotification({
          message: "Tous les champs marqués d'un * doivent être remplis",
          type: "error",
        })
      );
      return;
    }

    try {
      await professionService.createOrUpdateProfession(
        professionData,
        professionId || profession._id
      );
      dispatch(
        setNotification({
          message: "Formulaire soumis avec succès!",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/professions");
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
          {editProfession || professionId
            ? "Editer un métier"
            : "Créer un métier"}
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
            <h4>Nom du métier *</h4>
            <input
              className="input"
              type="text"
              name="name"
              value={profession.name}
              onChange={handleChange}
            />
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
                      profession.statsLimits[stat].min === null ||
                      profession.statsLimits[stat].min === 0
                        ? ""
                        : profession.statsLimits[stat].min
                    }
                    onChange={(e) => handleStatsChange(e, stat, "min")}
                  />
                  <input
                    type="number"
                    name={`max${stat}`}
                    max="999"
                    placeholder="Max"
                    value={
                      profession.statsLimits[stat].max === null ||
                      profession.statsLimits[stat].max === 0
                        ? ""
                        : profession.statsLimits[stat].max
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
            name="pr_nat_max"
            value={profession.pr_nat_max}
            onChange={handleChange}
          />

          <h4>Points de vie initiaux</h4>
          <input
            className="input"
            type="number"
            min="0"
            name="pv_init"
            value={profession.pv_init}
            onChange={handleChange}
          />
        </div>

        <div className="actions-section">
          <button className="submit btn">
            {editProfession || professionId
              ? "Mettre à jour"
              : "Créer le métier"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionForm;
