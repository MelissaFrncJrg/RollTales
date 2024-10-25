import Profession from "../models/professionModel.js";

// Créer une profession
export const createProfession = async (req, res) => {
  // Récupérer les données de la requête
  const { name, pv_init, pr_nat_max, statsLimits } = req.body;

  // Vérification des champs obligatoires
  if (!name) {
    return res.status(400).json({ message: "Le nom est obligatoire !" });
  }

  try {
    // créer une nouvelle instance du modèle avec les données récupérées
    const newProfession = new Profession({
      name,
      pv_init,
      pr_nat_max,
      statsLimits,
    });

    // sauvegarde des données
    await newProfession.save();

    // réponse en cas de succès
    res.status(201).json({
      message: "Métier créé avec succès!",
      professionId: newProfession._id,
    });
  } catch (error) {
    // gestion des erreurs si la création échoue
    console.log("erreur métier serveur:", error);
    res.status(500).json({ message: "Erreur lors de la création du métier" });
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

// Récupérer les métiers par ID
export const getProfessionById = async (req, res) => {
  try {
    // récupération de l'origine par son ID fourni dans les paramètres de la requête
    const profession = await Profession.findById(req.params.id);

    // Si l'origine n'est pas trouvée on affiche un erreur 404
    if (!profession) {
      return res.status(404).json({ message: "Métier non trouvé" });
    }

    // Sinon on renvoie l'origine
    res.status(200).json(profession);
  } catch (error) {
    // gestion de erreurs en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'ID du métier" });
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
