import Armor from "../models/armorModel.js";

// Ajouter une nouvelle armure
export const createArmor = async (req, res) => {
  try {
    const newArmor = new Armor(req.body);
    const savedArmor = await newArmor.save();
    res.status(201).json(savedArmor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'armure", error });
  }
};

// Obtenir toutes les armures
export const getArmors = async (req, res) => {
  try {
    const armors = await Armor.find();
    res.status(200).json(armors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des armures", error });
  }
};

// Mettre à jour une armure
export const updateArmor = async (req, res) => {
  try {
    const updatedArmor = await Armor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArmor) {
      return res.status(404).json({ message: "Armure non trouvée" });
    }
    res.status(200).json(updatedArmor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'armure", error });
  }
};

// Supprimer une armure
export const deleteArmor = async (req, res) => {
  try {
    const deletedArmor = await Armor.findByIdAndDelete(req.params.id);
    if (!deletedArmor) {
      return res.status(404).json({ message: "Armure non trouvée" });
    }
    res.status(200).json({ message: "Armure supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'armure", error });
  }
};
