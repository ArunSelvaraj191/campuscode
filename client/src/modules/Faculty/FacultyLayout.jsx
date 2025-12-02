import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import FacultySidebar from "../../components/FacultySidebar";

const FacultyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <FacultySidebar collapsed={collapsed} onToggle={handleToggle} />

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: collapsed ? "72px" : "220px",
          transition: "margin-left 220ms ease",
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default FacultyLayout;
