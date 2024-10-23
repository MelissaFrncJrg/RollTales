import React, { useState } from "react";
import axios from "axios";

import Toggle from "../toggle/Toggle";
import { useNavigate } from "react-router-dom";

const ArmorForm = () => {
  const navigate = useNavigate();

  const [armor, setArmor] = useState({
    nom: "",
    description: "",
    price: "",
    PR: "",
    type: "",
    weight: "",
    bonus: "",
    malus: "",
    rupture: "",
    lvl_min: "",
    resistance: "",
    benediction: "",
    origin: "",
    profession: "",
    magic: false,
    magic_effect: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setArmor({ ...armor, [name]: checked });
    } else {
      setArmor({ ...armor, [name]: value });
    }
  };
  const handleToggle = (value) => {
    setArmor({ ...armor, magic: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rolltales-api.onrender.com/armors", armor, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/elements");
    } catch (error) {
      console.error("Erreur lors de la création de l'armure :", error);
    }
  };

  return (
    <div className="form">
      <h1>Créer une Armure</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input
            type="text"
            name="nom"
            value={armor.nom}
            onChange={handleChange}
            required
            maxLength="50"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={armor.description}
            onChange={handleChange}
            maxLength="200"
          />
        </label>

        <label>
          Prix:
          <input
            type="number"
            name="price"
            value={armor.price}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <label>
          PR (Protection):
          <input
            type="number"
            name="PR"
            value={armor.PR}
            onChange={handleChange}
            required
            min="0"
            max="10"
          />
        </label>

        <label>
          Type:
          <input
            type="text"
            name="type"
            value={armor.type}
            onChange={handleChange}
            maxLength="25"
            required
          />
        </label>

        <label>
          Poids:
          <input
            type="number"
            name="weight"
            value={armor.weight}
            onChange={handleChange}
            min="0"
          />
        </label>

        <label>
          Bonus:
          <input
            type="text"
            name="bonus"
            value={armor.bonus}
            onChange={handleChange}
            maxLength="50"
          />
        </label>

        <label>
          Malus:
          <input
            type="text"
            name="malus"
            value={armor.malus}
            onChange={handleChange}
            maxLength="50"
          />
        </label>

        <label>
          Rupture:
          <input
            type="number"
            name="rupture"
            value={armor.rupture}
            onChange={handleChange}
            min="0"
          />
        </label>

        <label>
          Résistance:
          <input
            type="text"
            name="resistance"
            value={armor.resistance}
            onChange={handleChange}
            maxLength="100"
          />
        </label>

        <label>
          Bénédiction:
          <textarea
            name="benediction"
            value={armor.benediction}
            onChange={handleChange}
            maxLength="250"
          />
        </label>

        <label>
          Niveau Minimum:
          <input
            type="number"
            name="lvl_min"
            value={armor.lvl_min}
            onChange={handleChange}
            min="1"
          />
        </label>

        <label>
          Origine (ID):
          <input
            type="text"
            name="origin"
            value={armor.origin}
            onChange={handleChange}
          />
        </label>

        <label>
          Profession (ID):
          <input
            type="text"
            name="profession"
            value={armor.profession}
            onChange={handleChange}
          />
        </label>

        <Toggle
          setTrueFalse={handleToggle}
          choices={["Non", "Oui"]}
          title="Magique"
          checked={armor.magic}
          id="magicToggle"
        />

        {armor.magic && (
          <label>
            Effet Magique:
            <textarea
              name="magic_effect"
              value={armor.magic_effect}
              onChange={handleChange}
              maxLength="200"
            />
          </label>
        )}

        <button type="submit">Ajouter l'armure</button>
      </form>
    </div>
  );
};

export default ArmorForm;
