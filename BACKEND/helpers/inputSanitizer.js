import sanitizeHtml from "sanitize-html";

// Fonction pour échapper les caractères spéciaux potentiellement dangereux
const escapeSpecialChars = (value) => {
  return value
    .replace(/\$/g, "") // Supprime les signes $ pour éviter les injections NoSQL
    .replace(/{}/g, "") // Supprime les accolades pour éviter des injections de code
    .replace(/</g, "&lt;") // Échappe les chevrons < et >
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;") // Échappe les guillemets
    .replace(/'/g, "&#x27;"); // Échappe les apostrophes
};

// Fonction pour ne garder que quelques caractères autorisés
const filterAllowedCharacters = (value) => {
  return value.replace(/[^a-zA-Z0-9 .,']/g, "");
};

export const sanitizeInput = (value) => {
  // Nettoyer l'entrée en supprimant les balises HTML et les attributs non autorisés pour éviter les injections de scripts malveillants
  const cleanValue = sanitizeHtml(value, {
    allowedTags: [], // Pas de balises HTML autorisées
    allowedAttributes: {}, // Pas d'attributs HTML autorisés
  });

  // Appliquer la protection contre les caractères spéciaux non-HTML pour éviter les injections SQL/NoSQL
  const sanitizedValue = escapeSpecialChars(cleanValue);

  // Retourner la valeur nettoyée et sécurisée
  return sanitizedValue;
};
