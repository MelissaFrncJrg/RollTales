export const constForm = {
  regexEmail: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  passwordSize: 12,
  majRegex: /^(?=.*[A-Z])/,
  minRegex: /^(?=.*[a-z])/,
  digitRegex: /^(?=.*\d)/,
  specialCharRegex: /^(?=.*[@$!%*?&])/,
};

export const messageErrors = {
  regexEmail: {
    error: "Vérifiez le format de l'email",
  },
  alreadyInvited: {
    error: "Cet utilisateur a déjà été invité à cette campagne",
  },
  passwordSize: {
    error: `La longueur minimale du mot de passe est de ${constForm.passwordSize} caractères`,
  },
  majRegex: {
    error: "Le mot de passe doit contenir au moins une lettre majuscule",
  },
  minRegex: {
    error: "Le mot de passe doit contenir au moins une lettre minuscule",
  },
  digitRegex: {
    error: "Le mot de passe doit contenir au moins un chiffre",
  },
  specialCharRegex: {
    error:
      "Le mot de passe doit contenir au moins un caractère spécial parmi @$!%*?&",
  },
  samePassword: {
    error: "Les mots de passe ne correspondent pas",
  },
  sameAsOldPassword: {
    error: "Le nouveau mot de passe doit différer de l'ancien",
  },
};

const passwordValidationRules = [
  {
    test: (password) => password.length >= constForm.passwordSize,
    message: messageErrors.passwordSize.error,
  },
  {
    test: (password) => constForm.majRegex.test(password),
    message: messageErrors.majRegex.error,
  },
  {
    test: (password) => constForm.minRegex.test(password),
    message: messageErrors.minRegex.error,
  },
  {
    test: (password) => constForm.digitRegex.test(password),
    message: messageErrors.digitRegex.error,
  },
  {
    test: (password) => constForm.specialCharRegex.test(password),
    message: messageErrors.specialCharRegex.error,
  },
];

export const validatePassword = (password) => {
  for (const rule of passwordValidationRules) {
    if (!rule.test(password)) {
      return rule.message;
    }
  }
  return null;
};
