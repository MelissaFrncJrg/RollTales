import Weapon from "../models/weaponModel.js";

// Créer une arme
export const createWeapon = async (req, res) => {
  try {
    const weapon = new Weapon(req.body);
    await weapon.save();
    res.status(201).json(weapon);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'arme" });
  }
};

// Récupérer toutes les armes
export const getWeapons = async (req, res) => {
  try {
    const weapons = await Weapon.find();
    res.status(200).json(weapons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des armes" });
  }
};

// Mettre à jour une arme
export const updateWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!weapon) return res.status(404).json({ message: "Arme non trouvée" });
    res.status(200).json(weapon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'arme" });
  }
};

// Supprimer une arme
export const deleteWeapon = async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndDelete(req.params.id);
    if (!weapon) return res.status(404).json({ message: "Arme non trouvée" });
    res.status(200).json({ message: "Arme supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'arme" });
  }
};
