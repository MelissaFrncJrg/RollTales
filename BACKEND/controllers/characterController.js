import Character from "../models/characterModel.js";
import Origin from "../models/originModel.js";
import Profession from "../models/professionModel.js";
import Skill from "../models/skillModel.js";

// Créer un personnage et validation des références
export const createCharacter = async (req, res) => {
  const { origin, profession, skills } = req.body;

  try {
    // Vérifier si l'origine existe
    const originExists = await Origin.findById(origin);
    if (!originExists) {
      return res
        .status(404)
        .json({ message: "L'origine spécifiée n'existe pas." });
    }

    // Vérifier si le métier existe
    const professionExists = await Profession.findById(profession);
    if (!professionExists) {
      return res
        .status(404)
        .json({ message: "Le métier spécifié n'existe pas." });
    }

    // Vérifier si les compétences existent
    if (skills) {
      const validSkills = await Skill.find({ _id: { $in: skills } });
      if (validSkills.length !== skills.length) {
        return res
          .status(404)
          .json({ message: "Certaines compétences sont invalides." });
      }
    }

    // Création du personnage si tout est valide
    const newCharacter = new Character(req.body);
    await newCharacter.save();
    res.status(201).json(newCharacter);
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

// Mettre à jour un personnage
export const updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!character)
      return res.status(404).json({ message: "Personnage non trouvé" });
    res.status(200).json(character);
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
