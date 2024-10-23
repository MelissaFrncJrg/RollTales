export const togglePassword = (setHidePasswords, index) => {
  setHidePasswords((prevHidePasswords) => {
    const newHidePasswords = [...prevHidePasswords];
    newHidePasswords[index] = !newHidePasswords[index];
    return newHidePasswords;
  });
};
