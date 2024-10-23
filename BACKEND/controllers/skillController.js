import Skill from "../models/skillModel.js";

// Créer une compétence
export const createSkill = async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la compétence" });
  }
};

// Récupérer toutes les compétences
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des compétences" });
  }
};

// Mettre à jour une compétence
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!skill)
      return res.status(404).json({ message: "Compétence non trouvée" });
    res.status(200).json(skill);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la compétence" });
  }
};

// Supprimer une compétence
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill)
      return res.status(404).json({ message: "Compétence non trouvée" });
    res.status(200).json({ message: "Compétence supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la compétence" });
  }
};
