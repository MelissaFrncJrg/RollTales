import Profession from "../models/professionModel.js";

// Créer une profession
export const createProfession = async (req, res) => {
  try {
    const profession = new Profession(req.body);
    await profession.save();
    res.status(201).json(profession);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la profession" });
  }
};

// Récupérer toutes les professions
export const getProfessions = async (req, res) => {
  try {
    const professions = await Profession.find();
    res.status(200).json(professions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des professions" });
  }
};

// Mettre à jour une profession
export const updateProfession = async (req, res) => {
  try {
    const profession = await Profession.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!profession)
      return res.status(404).json({ message: "Profession non trouvée" });
    res.status(200).json(profession);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la profession" });
  }
};

// Supprimer une profession
export const deleteProfession = async (req, res) => {
  try {
    const profession = await Profession.findByIdAndDelete(req.params.id);
    if (!profession)
      return res.status(404).json({ message: "Profession non trouvée" });
    res.status(200).json({ message: "Profession supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la profession" });
  }
};
