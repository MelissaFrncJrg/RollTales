import Character from "../models/characterModel.js";
import Armor from "../models/armorModel.js";
import Origin from "../models/originModel.js";
import Profession from "../models/professionModel.js";
import Weapon from "../models/weaponModel.js";

// Fonction pour calculer les statistiques selon les limites de l'origine et du métier
const calculateStat = (statName, originLimits, professionLimits) => {
  const minLimit = Math.max(
    originLimits[statName]?.min ?? -Infinity,
    professionLimits[statName]?.min ?? -Infinity
  );
  const maxLimit = Math.min(
    originLimits[statName]?.max ?? Infinity,
    professionLimits[statName]?.max ?? Infinity
  );
  return minLimit !== -Infinity && maxLimit !== Infinity
    ? Math.floor(minLimit + maxLimit)
    : null;
};

// Créer un personnage et validation des références
export const createCharacter = async (req, res) => {
  const {
    name,
    origin,
    profession,
    equipment,
    inventory,
    gold,
    level,
    experience,
    currentPV,
    maxPV,
    magicPR,
    naturalPR,
    address,
    strength,
    intelligence,
    charisma,
    courage,
    magicAbility,
    totalWeight,
    weightLimit,
    bankAccount,
    notes = [],
  } = req.body;

  if (
    name === undefined ||
    !origin ||
    level === undefined ||
    currentPV === undefined ||
    address === undefined ||
    strength === undefined ||
    intelligence === undefined ||
    courage === undefined ||
    charisma === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Vous devez remplir les champs obligatoires!" });
  }

  try {
    // Vérifier si l'origine existe
    const originData = await Origin.findById(origin);
    if (!originData) {
      return res
        .status(404)
        .json({ message: "L'origine spécifiée n'existe pas." });
    }

    // Si un métier est choisi, récupère les données correspondantes
    let professionData = null;
    if (profession) {
      professionData = await Profession.findById(profession);
      if (!professionData) {
        return res
          .status(404)
          .json({ message: "Le métier spécifié n'existe pas." });
      }
    }

    // Calcul des statistiques par défaut basées sur les limites de l'origine et du métier

    const calculatedStats = {
      courage: calculateStat(
        "courage",
        originData.statsLimits,
        professionData?.statsLimits || 0
      ),
      force: calculateStat(
        "force",
        originData.statsLimits,
        professionData?.statsLimits || 0
      ),
      address: calculateStat(
        "adresse",
        originData.statsLimits,
        professionData?.statsLimits || 0
      ),
      intelligence: calculateStat(
        "intelligence",
        originData.statsLimits,
        professionData?.statsLimits || 0
      ),
      charisma: calculateStat(
        "charisme",
        originData.statsLimits,
        professionData?.statsLimits || 0
      ),
      maxPV: originData.initialHealthPoints + (professionData?.pv_init || 0),
    };

    // Vérifier si les armes existent
    if (equipment && equipment.armes) {
      const validWeapons = await Weapon.find({ _id: { $in: equipment.armes } });
      if (validWeapons.length !== equipment.armes.length) {
        return res
          .status(404)
          .json({ message: "Certaines armes sont invalides." });
      }
    }

    // Vérifier si les armures existent
    if (equipment && equipment.armures) {
      const validArmors = await Armor.find({ _id: { $in: equipment.armures } });
      if (validArmors.length !== equipment.armures.length) {
        return res
          .status(404)
          .json({ message: "Certaines armures sont invalides." });
      }
    }

    // Vérification de l'utilisateur
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "Utilisateur non authentifié." });
    }

    // Création du personnage si tout est valide
    const newCharacter = new Character({
      ...req.body,
      ...calculatedStats,
      user: req.user._id,
    });

    await newCharacter.save();

    res.status(201).json({
      message: "Personnage créé avec succès!",
      originId: newCharacter._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du personnage." });
  }
};

// Récupérer tous les personnages
export const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json(characters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des personnages" });
  }
};

// récupèrer les personnages de l'utilisateur
export const getUserCharacters = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Utilisateur non authentifié !" });
    }

    const characters = await Character.find({ user: req.user._id });
    res.status(200).json(characters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des personnages" });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    // récupération de l'origine par son ID fourni dans les paramètres de la requête
    const character = await Character.findById(req.params.id);

    // Si l'origine n'est pas trouvée on affiche un erreur 404
    if (!character) {
      return res.status(404).json({ message: "Personnage non trouvée" });
    }

    // Sinon on renvoie l'origine
    res.status(200).json(character);
  } catch (error) {
    // gestion de erreurs en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du personnage" });
  }
};

// Mettre à jour un personnage
export const updateCharacter = async (req, res) => {
  const { origin, profession, ...updateData } = req.body;

  try {
    const character = await Character.findById(req.param.id);

    if (!character) {
      return res.status(404).json({ message: "Personnage non trouvé" });
    }

    // epêcher la modification de l'origine et du métier
    if (character.origin && origin && origin !== character.origin.toString()) {
      return res
        .status(400)
        .json({ message: "La modification de l'origine n'est pas autorisée!" });
    }

    if (
      character.profession &&
      profession &&
      profession !== character.profession.toString()
    ) {
      return res
        .status(400)
        .json({ message: "La modification du métier n'est pas autorisée!" });
    }

    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    res.status(200).json(updatedCharacter);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du personnage" });
  }
};

// Supprimer un personnage
export const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character)
      return res.status(404).json({ message: "Personnage non trouvé" });
    res.status(200).json({ message: "Personnage supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du personnage" });
  }
};
