import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { characterService } from "../../services/charactersService";
import { originService } from "../../services/originService";
import { professionService } from "../../services/professionService";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";
import Toggle from "../toggle/Toggle";

import "../../assets/styles/variables.scss";
import "./characters-responsive.scss";

const CreateCharacter = ({ isEdit = false, characterData = {} }) => {
  const [name, setName] = useState(characterData.name || "");
  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(
    characterData.origin || ""
  );
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(
    characterData.profession || ""
  );
  const [equipment, setEquipment] = useState({
    armes: characterData.equipment?.armes || [],
    armures: characterData.equipment?.armures || [],
  });
  const [inventory, setInventory] = useState({
    items: characterData.inventory?.items || [
      { name: "", quantity: 1, description: "" },
    ],
    gold: characterData.inventory?.gold || 0,
  });
  const [isGoldValid, setIsGoldValid] = useState(true);
  const [address, setAddress] = useState(characterData.address || 0);
  const [strength, setStrength] = useState(characterData.strength || 0);
  const [charisma, setCharisma] = useState(characterData.charisma || 0);
  const [intelligence, setIntelligence] = useState(
    characterData.intelligence || 0
  );
  const [courage, setCourage] = useState(characterData.courage || 0);
  const [level, setLevel] = useState(characterData.level || 1);
  const [experience, setExperience] = useState(characterData.experience || 0);
  const [currentPV, setCurrentPV] = useState(characterData.currentPV || 0);
  const [maxPV, setMaxPV] = useState(characterData.maxPV || 0);
  const [magicPR, setMagicPR] = useState(characterData.magicPR || 0);
  const [naturalPR, setNaturalPR] = useState(characterData.naturalPR || 0);
  const [totalPR, setTotalPR] = useState(characterData.naturalPR || 0);
  const [magicAbility, setMagicAbility] = useState(
    characterData.magicAbility || 0
  );
  const [totalWeight, setTotalWeight] = useState(
    characterData.totalWeight || 0
  );
  const [weightLimit, setWeightLimit] = useState(
    characterData.weightLimit || 0
  );
  const [bankAccount, setBankAccount] = useState({
    hasAccount: characterData.bankAccount?.hasAccount || false,
    hasCheckBook: characterData.bankAccount?.hasCheckBook || false,
    goldStored: characterData.bankAccount?.goldStored || 0,
    valuables: characterData.bankAccount?.valuables || [
      { name: "", quantity: 1, description: "" },
    ],
  });
  const [notes, setNotes] = useState(characterData.notes?.join("\n") || "");

  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notification = useSelector((state) => state.notification);

  const calculateStats = (
    statName,
    originLimits = {},
    professionLimits = {}
  ) => {
    const originMin = originLimits[statName]?.min ?? -Infinity;
    const originMax = originLimits[statName]?.max ?? Infinity;
    const professionMin = professionLimits[statName]?.min ?? -Infinity;
    const professionMax = professionLimits[statName]?.max ?? Infinity;

    // on récupère la plus haute valeur de min et la plus basse valeur de max
    const minLimit = Math.max(originMin, professionMin);
    const maxLimit = Math.min(originMax, professionMax);

    // si aucune limite n'est renseignée on retourne 0 par défaut
    if (minLimit === -Infinity && maxLimit === Infinity) return 0;

    // si une des deux limites est renseignée on retourne cette valeur
    if (minLimit === -Infinity) return maxLimit !== Infinity ? maxLimit : 0;
    if (maxLimit === Infinity) return minLimit !== -Infinity ? minLimit : 0;

    // si les deux limites sont fixées on retourne la valeur minimale
    return minLimit;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const originsResponse = await originService.fetchOrigins();
        setOrigins(originsResponse);

        const professionsResponse = await professionService.fetchProfessions();
        setProfessions(professionsResponse);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  const updateStats = async () => {
    if (selectedOrigin || selectedProfession) {
      let originData = {};
      let professionData = {};

      if (selectedOrigin) {
        originData = await originService.getOriginById(selectedOrigin);
      }
      if (selectedProfession) {
        professionData = await professionService.getProfessionById(
          selectedProfession
        );
      }

      setCourage(
        calculateStats(
          "courage",
          originData?.statsLimits,
          professionData?.statsLimits
        )
      );
      setStrength(
        calculateStats(
          "force",
          originData?.statsLimits,
          professionData?.statsLimits
        )
      );
      setAddress(
        calculateStats(
          "adresse",
          originData?.statsLimits,
          professionData?.statsLimits
        )
      );
      setIntelligence(
        calculateStats(
          "intelligence",
          originData?.statsLimits,
          professionData?.statsLimits
        )
      );
      setCharisma(
        calculateStats(
          "charisme",
          originData?.statsLimits,
          professionData?.statsLimits
        )
      );

      const initialHealthPoints = originData?.initialHealthPoints ?? 0;
      const professionInitialPV = professionData?.pv_init ?? 0;

      setMaxPV(initialHealthPoints + professionInitialPV);
    }
  };

  useEffect(() => {
    updateStats();
  }, [selectedOrigin, selectedProfession]);

  // Vérifier les caractères autorisés dans les champs de texte
  const validateText = (value) => {
    const allowedCharacters = /^[a-zA-Z0-9 .,']*$/;
    return allowedCharacters.test(value);
  };

  const checkRequiredFields = () => {
    setRequiredFieldsFilled(
      name &&
        selectedOrigin &&
        level > 0 &&
        currentPV > 0 &&
        address > 0 &&
        strength > 0 &&
        intelligence > 0 &&
        courage > 0 &&
        charisma > 0 &&
        isGoldValid
    );
  };

  useEffect(() => {
    checkRequiredFields();
  }, [
    name,
    selectedOrigin,
    level,
    currentPV,
    address,
    strength,
    intelligence,
    courage,
    charisma,
    isGoldValid,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Création de l'objet personnage avec les champs requis
    const characterData = {
      name,
      origin: selectedOrigin,
      profession: selectedProfession,
      equipment: {
        armes: equipment.armes,
        armures: equipment.armures,
      },
      inventory: {
        items: inventory.items,
        gold: Number(inventory.gold),
      },
      bankAccount: {
        hasAccount: bankAccount.hasAccount,
        hasCheckbook: bankAccount.hasCheckbook,
        goldStored: Number(bankAccount.goldStored),
        valuables: bankAccount.valuables,
      },
      level: Number(level),
      experience: Number(experience),
      currentPV: Number(currentPV),
      maxPV: Number(maxPV),
      magicPR: Number(magicPR),
      naturalPR: Number(naturalPR),
      totalPR: Number(totalPR),
      address: Number(address),
      strength: Number(strength),
      intelligence: Number(intelligence),
      charisma: Number(charisma),
      courage: Number(courage),
      magicAbility: Number(magicAbility),
      totalWeight: Number(totalWeight),
      weightLimit: Number(weightLimit),
      ...(notes.trim() ? { notes: notes.split("\n") } : {}),
    };

    // vérifier si le nombre de golds enregistré dans la bourse ne dépasse pas la limite
    if (!isGoldValid) {
      dispatch(
        setNotification({
          message: "Le montant d'or dépasse la limite autorisée!",
          type: "error",
        })
      );
      return;
    }

    // vérifier si des caractères autorisés sont dans les notes
    if (!validateText(notes)) {
      dispatch(
        setNotification({
          message: "Les notes contiennent des caractères non autorisés",
          type: "error",
        })
      );
      return;
    }

    try {
      await characterService.createOrUpdateCharacter(characterData);
      dispatch(
        setNotification({
          message: isEdit
            ? "Personnage mis à jour avec succès!"
            : "Personnage créé avec succès!",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        navigate("/my-characters");
      }, 3000);
    } catch (error) {
      console.error(
        "Erreur lors de la création/mise à jour du personnage :",
        error
      );
    }
  };

  // Fonction pour ajouter un nouvel item
  const isItemNameValid = (items, index) => items[index].name.trim() !== "";

  // Fonction générique pour ajouter un nouvel élément (item ou valuable)
  const addElement = (type) => {
    if (type === "item") {
      setInventory((prevInventory) => ({
        ...prevInventory,
        items: [
          ...prevInventory.items,
          { name: "", quantity: 1, description: "" },
        ],
      }));
    } else if (type === "valuable") {
      setBankAccount((prevAccount) => ({
        ...prevAccount,
        valuables: [
          ...prevAccount.valuables,
          { name: "", quantity: 1, description: "" },
        ],
      }));
    }
  };

  // Fonction générique pour gérer les modifications d'un élément (item ou valuable)
  const handleElementChange = (type, index, field, value) => {
    if (type === "item") {
      const updatedItems = [...inventory.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      setInventory({ ...inventory, items: updatedItems });
    } else if (type === "valuable") {
      const updatedValuables = [...bankAccount.valuables];
      updatedValuables[index] = { ...updatedValuables[index], [field]: value };
      setBankAccount({ ...bankAccount, valuables: updatedValuables });
    }
  };

  // Fonction pour supprimer un item
  const removeItem = (index) => {
    const updatedItems = inventory.items.filter((_, i) => i !== index);
    setInventory({ ...inventory, items: updatedItems });
  };

  const handleGoldChange = (e) => {
    const newGoldValue = Number(e.target.value);

    if (newGoldValue > 250) {
      dispatch(
        setNotification({
          message:
            "Vous ne pouvez pas transporter plus de 250 pièces d'or sur vous. Vous pouvez confier le surplus à un allié de confiance (à vos risques et périls)",
          type: "error",
        })
      );
      setIsGoldValid(false);
    } else {
      setInventory((prevInventory) => ({
        ...prevInventory,
        gold: newGoldValue,
      }));
      setIsGoldValid(true);
      dispatch(clearNotification());
    }
  };

  // Fonction de gestion du Toggle
  const handleToggleChange = (field) => {
    setBankAccount((prevAccount) => ({
      ...prevAccount,
      [field]: !prevAccount[field],
    }));
  };

  return (
    <div className="container">
      <div>
        <h1>{isEdit ? "Modifier" : "Créer"} un personnage</h1>
        <div className="underline" />
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div>
          <h3>Caractéristiques générales</h3>
          <div className="underline" />

          <div className="general-group">
            <h4 htmlFor="name">Nom du personnage</h4>
            <input
              className="input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <h4 htmlFor="origin">Origine</h4>
            <select
              className="dropdown"
              id="origin"
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              disabled={isEdit}
              required={!isEdit}
            >
              <option value="">Sélectionner une origine</option>
              {origins.map((origin) => (
                <option key={origin._id} value={origin._id}>
                  {origin.name}
                </option>
              ))}
            </select>

            <h4 htmlFor="profession">Métier</h4>
            <select
              className="dropdown"
              id="profession"
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              disabled={isEdit}
            >
              <option value="">Sélectionner un métier</option>
              {professions.map((profession) => (
                <option key={profession._id} value={profession._id}>
                  {profession.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="statistics-form">
          <h3>Statistiques du personnage</h3>
          <div className="underline"></div>

          <div className="character-stat-group">
            <div className="edit-group">
              <label htmlFor="level">Niveau</label>
              <input
                className="edit input"
                type="number"
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="experience">Expérience</label>
              <input
                className="edit input"
                type="number"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min={0}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="maxPV">PV Maximum</label>
              <input
                className="edit input"
                type="number"
                id="maxPV"
                value={maxPV}
                onChange={(e) => setMaxPV(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="magicPR">Protection Magique</label>
              <input
                className="edit input"
                type="number"
                id="magicPR"
                value={magicPR}
                onChange={(e) => setMagicPR(e.target.value)}
                min={0}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="naturalPR">Protection Naturelle</label>
              <input
                className="edit input"
                type="number"
                id="naturalPR"
                value={naturalPR}
                onChange={(e) => setNaturalPR(e.target.value)}
                min={0}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="address">Adresse (AD)</label>
              <input
                className="edit input"
                type="number"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="strength">Force (FO)</label>
              <input
                className="edit input"
                type="number"
                id="strength"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="courage">Courage (COU)</label>
              <input
                className="edit input"
                type="number"
                id="courage"
                value={courage}
                onChange={(e) => setCourage(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="intelligence">Intelligence (INT)</label>
              <input
                className="edit input"
                type="number"
                id="intelligence"
                value={intelligence}
                onChange={(e) => setIntelligence(e.target.value)}
                required
                min={1}
              />
            </div>
            <div className="edit-group">
              <label htmlFor="charisma">Charisme (CHA)</label>
              <input
                className="edit input"
                type="number"
                id="charisma"
                value={charisma}
                onChange={(e) => setCharisma(e.target.value)}
                required
                min={1}
              />
            </div>
          </div>
        </div>

        {isEdit && (
          <div className="edition-mode">
            <h3>Mode édition</h3>
            <div className="underline"></div>
            <div className="edit-character">
              <div className="edit-group">
                <label htmlFor="currentPV">PV actuels</label>
                <input
                  className="edit input"
                  type="number"
                  id="currentPV"
                  value={currentPV}
                  onChange={(e) => setCurrentPV(e.target.value)}
                  min={1}
                />
              </div>
              <div className="edit-group">
                <label htmlFor="magicAbility">Mana (PA)</label>
                <input
                  className="edit input"
                  type="number"
                  id="magicAbility"
                  value={magicAbility}
                  onChange={(e) => setMagicAbility(e.target.value)}
                  min={1}
                />
              </div>
              <div className="edit-group">
                <label htmlFor="totalPR">PR totale</label>
                <input
                  className="edit input"
                  type="number"
                  id="totalPR"
                  value={totalPR}
                  onChange={(e) => setTotalPR(e.target.value)}
                  min={1}
                />
              </div>
              <div className="edit-group">
                <label htmlFor="totalWeight">Poids porté (kg)</label>
                <input
                  className="edit input"
                  type="number"
                  id="totalWeight"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  min={1}
                />
              </div>

              <div className="character-inventory">
                <div className="item-section">
                  <h2 className="inventory-title">Compte Bancaire</h2>
                  <div className="toggle-section">
                    <Toggle
                      setTrueFalse={() => handleToggleChange("hasAccount")}
                      choices={["Non", "Oui"]}
                      title="Compte en banque"
                      checked={bankAccount.hasAccount}
                      id="toggle-bank-account"
                    />
                    <Toggle
                      setTrueFalse={() => handleToggleChange("hasCheckBook")}
                      choices={["Non", "Oui"]}
                      title="Chéquier"
                      checked={bankAccount.hasCheckBook}
                      id="toggle-checkbook"
                    />
                  </div>
                  {bankAccount.hasAccount && (
                    <>
                      <div className="gold-section">
                        <label htmlFor="goldStored">Or stocké en banque</label>
                        <input
                          className="edit input"
                          type="number"
                          id="goldStored"
                          value={bankAccount.goldStored}
                          onChange={(e) =>
                            setBankAccount((prevAccount) => ({
                              ...prevAccount,
                              goldStored: Number(e.target.value),
                            }))
                          }
                          min={0}
                        />
                      </div>

                      <div className="items-section">
                        <h3>Biens du coffre-fort</h3>
                        {bankAccount.valuables.length > 0 ? (
                          bankAccount.valuables.map((valuable, index) => (
                            <div key={index} className="item">
                              <div className="item-row">
                                <label>Nom</label>
                                <input
                                  type="text"
                                  className="input"
                                  value={valuable.name}
                                  onChange={(e) =>
                                    handleElementChange(
                                      "valuable",
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nom du bien"
                                />

                                <label>Quantité</label>
                                <input
                                  type="number"
                                  className="input"
                                  value={valuable.quantity}
                                  onChange={(e) =>
                                    handleElementChange(
                                      "valuable",
                                      index,
                                      "quantity",
                                      Number(e.target.value)
                                    )
                                  }
                                  min={1}
                                />
                              </div>

                              <div className="item-row description-row">
                                <label>Description</label>
                                <input
                                  type="text"
                                  className="edit input"
                                  value={valuable.description}
                                  onChange={(e) =>
                                    handleElementChange(
                                      "valuable",
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Description"
                                />
                              </div>

                              <div className="items-button-container">
                                <div className="tooltip-wrapper">
                                  <FontAwesomeIcon
                                    className="add-item"
                                    icon={faPlusCircle}
                                    type="button"
                                    onClick={() => addElement("item")} // Appel pour ajouter un item
                                    disabled={
                                      !isItemNameValid(inventory.items, index)
                                    }
                                  />
                                  <span className="tooltip-text">
                                    Ajouter cet objet précieux
                                  </span>
                                </div>

                                {bankAccount.valuables.length > 1 && (
                                  <div className="tooltip-wrapper">
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      alt="Supprimer l'objet précieux"
                                      className="delete-item"
                                      type="button"
                                      onClick={() =>
                                        handleElementChange(
                                          "item",
                                          index,
                                          "name",
                                          ""
                                        )
                                      }
                                    />
                                    <span className="tooltip-text">
                                      Supprimer cet objet précieux
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Aucun bien précieux ajouté pour l'instant</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="character-inventory">
                <h2 className="inventory-title">Inventaire</h2>
                <h3>Richesses et possessions</h3>
                <div>
                  <div className="gold-section">
                    <label htmlFor="gold">Or</label>
                    <input
                      className="input"
                      type="number"
                      id="gold"
                      value={inventory.gold}
                      onChange={handleGoldChange}
                      min={0}
                    />
                  </div>
                  <div className="items-section">
                    <h3>Items</h3>
                    <h4>Biens précieux</h4>

                    {inventory.items.length > 0 ? (
                      inventory.items.map((item, index) => (
                        <div key={index} className="item">
                          <div className="item-row">
                            <label>Nom</label>
                            <input
                              type="text"
                              className="input"
                              value={item.name}
                              onChange={(e) =>
                                handleElementChange(
                                  "item",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Nom de l'item"
                            />

                            <label>Quantité</label>
                            <input
                              type="number"
                              className="input"
                              value={item.quantity}
                              onChange={(e) =>
                                handleElementChange(
                                  "item",
                                  index,
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                              min={1}
                            />
                          </div>

                          <div className="item-row description-row">
                            <label>Description</label>
                            <input
                              type="text"
                              className="input"
                              value={item.description}
                              onChange={(e) =>
                                handleElementChange(
                                  "item",
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                            />
                          </div>

                          <div className="items-button-container">
                            <div className="tooltip-wrapper">
                              <FontAwesomeIcon
                                className="add-item"
                                icon={faPlusCircle}
                                type="button"
                                onClick={addElement("valuable")}
                                disabled={
                                  !isItemNameValid(inventory.items, index)
                                }
                              />
                              <span className="tooltip-text">
                                Ajouter cet item
                              </span>
                            </div>

                            {inventory.items.length > 1 && (
                              <div className="tooltip-wrapper">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  alt="Supprimer l'item"
                                  className="delete-item"
                                  type="button"
                                  onClick={() => removeItem(index)}
                                />
                                <span className="tooltip-text">
                                  Supprimer cet item
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Aucun item créé pour l'instant</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="notes-section">
          <label className="notes" htmlFor="notes">
            Lore et notes de campagne
          </label>
          <textarea
            className="input"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        {notification.message && (
          <p className={notification.type === "error" ? "error" : "success"}>
            {notification.message}
          </p>
        )}
        <button
          className="submit btn"
          type="submit"
          disabled={!requiredFieldsFilled || !isGoldValid}
        >
          {isEdit ? "Mettre à jour" : "Créer le personnage"}
        </button>
      </form>
    </div>
  );
};

export default CreateCharacter;
