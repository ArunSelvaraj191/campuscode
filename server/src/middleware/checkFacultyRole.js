export const checkFacultyRole = (req, res, next) => {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(403).json({
      error: "Access denied. Only faculty members can perform this action.",
    });
  }
  next();
};
