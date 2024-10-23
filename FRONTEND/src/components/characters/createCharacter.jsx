import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/variables.scss";

const CreateCharacter = () => {
  const [name, setName] = useState("");
  const [origins, setOrigins] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [address, setAddress] = useState(0);
  const [strength, setStrength] = useState(0);
  const [charism, setCharisme] = useState(0);
  const [intelligence, setIntelligence] = useState(0);
  const [courage, setCourage] = useState(0);
  const [level, setLevel] = useState(1);
  const navigate = useNavigate();

  // Récupèrer les origines, métiers, et skills disponibles lorsque le composant est monté
  useEffect(() => {
    const fetchData = async () => {
      try {
        const originsResponse = await axios.get(
          "https://rolltales-api.onrender.com/origins"
        );
        setOrigins(originsResponse.data);

        const professionsResponse = await axios.get(
          "https://rolltales-api.onrender.com/professions"
        );
        setProfessions(professionsResponse.data);

        const skillsResponse = await axios.get(
          "https://rolltales-api.onrender.com/skills"
        );
        setSkills(skillsResponse.data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Création de l'objet personnage avec les champs requis
    const characterData = {
      name,
      origin: selectedOrigin,
      profession: selectedProfession,
      level,
      address,
      strength,
      skills: selectedSkills,
    };

    try {
      await axios.post(
        "https://rolltales-api.onrender.com/characters",
        characterData,
        {
          withCredentials: true,
        }
      );
      // Redirection vers la liste des personnages créés
      navigate("/my-characters");
    } catch (error) {}
  };

  return (
    <div className="create container">
      <div className="form-header">
        <h1>Créer un personnage</h1>
        <div className="underline" />
      </div>

      <form className="character-form" onSubmit={handleSubmit}>
        <div className="form">
          <label htmlFor="name">Nom du personnage</label>
          <input
            className="input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form">
          <label htmlFor="origin">Origine</label>
          <select
            id="origin"
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            required
          >
            <option value="">Sélectionner une origine</option>
            {origins.map((origin) => (
              <option key={origin._id} value={origin._id}>
                {origin.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form">
          <label htmlFor="profession">Métier</label>
          <select
            id="profession"
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            required
          >
            <option value="">Sélectionner un métier</option>
            {professions.map((profession) => (
              <option key={profession._id} value={profession._id}>
                {profession.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form">
          <label htmlFor="level">Niveau</label>
          <input
            className="input"
            type="number"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            min={1}
          />
        </div>
        <div className="statistics-group">
          <div className="form">
            <label htmlFor="address">Adresse (AD)</label>
            <input
              className="input"
              type="number"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              min={1}
            />
          </div>

          <div className="form">
            <label htmlFor="strength">Force (FO)</label>
            <input
              className="input"
              type="number"
              id="strength"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              required
              min={1}
            />
          </div>

          <div className="form">
            <label htmlFor="courage">Courage (COU)</label>
            <input
              className="input"
              type="number"
              id="courage"
              value={courage}
              onChange={(e) => setCourage(e.target.value)}
              required
              min={1}
            />
          </div>

          <div className="form">
            <label htmlFor="intelligence">Intelligence (INT)</label>
            <input
              className="input"
              type="number"
              id="intelligence"
              value={intelligence}
              onChange={(e) => setIntelligence(e.target.value)}
              required
              min={1}
            />
          </div>

          <div className="form">
            <label htmlFor="strength">Charisme (CHA)</label>
            <input
              className="input"
              type="number"
              id="charism"
              value={charism}
              onChange={(e) => setCharisme(e.target.value)}
              required
              min={1}
            />
          </div>
        </div>
        <div className="form">
          <label htmlFor="skills">Compétences</label>
          <select
            id="skills"
            multiple
            value={selectedSkills}
            onChange={(e) =>
              setSelectedSkills(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          ></select>
          {skills.map((skill) => (
            <option key={skill._id} value={skill._id}>
              {skill.nom}
            </option>
          ))}
        </div>

        <button className="submit btn" type="submit">
          Créer le personnage
        </button>
      </form>
    </div>
  );
};

export default CreateCharacter;
