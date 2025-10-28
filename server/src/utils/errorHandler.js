// Common error responses
export const sendServerError = (res, err) => {
  console.error(err);
  return res.status(500).json({ message: "Server error", error: err.message });
};

export const sendNotFoundError = (res, entity = "Item") => {
  return res.status(404).json({ message: `${entity} not found` });
};

export const sendValidationError = (res, message) => {
  return res.status(400).json({ message });
};

export const sendUnauthorizedError = (
  res,
  message = "Invalid credentials."
) => {
  return res.status(401).json({ message });
};

export const sendForbiddenError = (res, message = "Access denied.") => {
  return res.status(403).json({ message });
};
