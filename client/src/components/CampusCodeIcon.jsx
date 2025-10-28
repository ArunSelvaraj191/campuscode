import React from "react";
import Box from "@mui/material/Box";

/**
 * CampusCodeIcon - A circular icon with primary color and shadow.
 * @param {object} props
 * @param {number} [props.size=12] - Diameter of the icon in px.
 * @param {string} [props.color="primary.main"] - MUI color string.
 * @returns {JSX.Element}
 */
const CampusCodeIcon = ({ size = 12, color = "primary.main" }) => (
  <Box
    sx={{
      width: size,
      height: size,
      bgcolor: color,
      borderRadius: "50%",
      boxShadow: (theme) => `0 0 0 6px ${theme.palette.primary.main}22`,
      display: "inline-block",
    }}
  />
);

export default CampusCodeIcon;
