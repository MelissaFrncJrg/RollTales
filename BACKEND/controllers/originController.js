import Origin from "../models/originModel.js";

// Créer une origine
export const createOrigin = async (req, res) => {
  try {
    const origin = new Origin(req.body);
    await origin.save();
    res.status(201).json(origin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'origine" });
  }
};

// Récupérer toutes les origines
export const getOrigins = async (req, res) => {
  try {
    const origins = await Origin.find();
    res.status(200).json(origins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des origines" });
  }
};

// Mettre à jour une origine
export const updateOrigin = async (req, res) => {
  try {
    const origin = await Origin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!origin)
      return res.status(404).json({ message: "Origine non trouvée" });
    res.status(200).json(origin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'origine" });
  }
};

// Supprimer une origine
export const deleteOrigin = async (req, res) => {
  try {
    const origin = await Origin.findByIdAndDelete(req.params.id);
    if (!origin)
      return res.status(404).json({ message: "Origine non trouvée" });
    res.status(200).json({ message: "Origine supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'origine" });
  }
};
