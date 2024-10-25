import Origin from "../models/originModel.js";

// Créer une origine
export const createOrigin = async (req, res) => {
  // Récupérer les données de la requête
  const {
    name,
    description,
    allowsMagic,
    statsLimits,
    maxNaturalPR,
    initialHealthPoints,
    equipmentRestrictions,
    innateAbilities,
    specialNotes,
    skillsStart,
  } = req.body;

  // Vérification des champs obligatoires
  if (!name || initialHealthPoints === undefined || initialHealthPoints <= 0) {
    return res
      .status(400)
      .json({ message: "Vous devez remplir les champs obligatoires!" });
  }

  try {
    // créer une nouvelle instance du modèle avec les données récupérées
    const newOrigin = new Origin({
      name,
      description,
      allowsMagic,
      statsLimits,
      maxNaturalPR,
      initialHealthPoints,
      equipmentRestrictions,
      innateAbilities,
      specialNotes,
      skillsStart,
    });

    // sauvegarde des données
    await newOrigin.save();

    // réponse en cas de succès
    res.status(201).json({
      message: "Origine créée avec succès!",
      originId: newOrigin._id,
    });
  } catch (error) {
    // gestion des erreurs si la création échoue
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

// Récupèrer une origine par son id
export const getOriginById = async (req, res) => {
  try {
    // récupération de l'origine par son ID fourni dans les paramètres de la requête
    const origin = await Origin.findById(req.params.id);

    // Si l'origine n'est pas trouvée on affiche un erreur 404
    if (!origin) {
      return res.status(404).json({ message: "Origine non trouvée" });
    }

    // Sinon on renvoie l'origine
    res.status(200).json(origin);
  } catch (error) {
    // gestion de erreurs en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'origine" });
  }
};

// Mettre à jour une origine
export const updateOrigin = async (req, res) => {
  try {
    // On r&cupère les données de req.body pour mettre à jour l'origine
    const origin = await Origin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!origin)
      return res.status(404).json({ message: "Origine non trouvée" });
    res.status(200).json({ message: "Origine mise à jour avec succès!" });
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
