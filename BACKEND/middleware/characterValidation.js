export const validateCharacter = (req, res, next) => {
  const { error } = characterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
