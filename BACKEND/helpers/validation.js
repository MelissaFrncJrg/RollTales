// Fonction pour valider les données
export const validateData = ({ lastname, pseudo, email, password }) => {
  let errors = {};

  // Vérifier que tous les champs requis sont remplis
  if (!lastname || !pseudo || !email || !password) {
    errors.global = "Tous les champs doivent être remplis.";
  }

  // Validation du format de l'email
  if (email && !isValidEmail(email)) {
    errors.email = "L'email n'est pas au bon format.";
  }

  // Regex pour le mdp, doit contenir au moins 12 caractères, une majuscule et une minuscule
  if (password && !isValidPassword(password)) {
    errors.password =
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule et une minuscule.";
  }

  return errors;
};

// Fonction pour valider le format de l'email
const isValidEmail = (email) => {
  // Utilisation d'une regex  pour valider l'email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Fonction pour valider le mot de passe
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
  return passwordRegex.test(password);
};

// gérer els erreurs du formaulaire de mise à jour du profil
export const validateUpdatedData = ({ pseudo, email, password }) => {
  let errors = {};

  // Validation des champs uniquement s'ils sont présents
  if (email && !isValidEmail(email)) {
    errors.email = "L'email n'est pas au bon format.";
  }

  if (password && !isValidPassword(password)) {
    errors.password =
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule et une minuscule.";
  }

  // Optionally, validate pseudo if needed
  if (pseudo && pseudo.length < 3) {
    errors.pseudo = "Le pseudo doit contenir au moins 3 caractères.";
  }

  return errors;
};
