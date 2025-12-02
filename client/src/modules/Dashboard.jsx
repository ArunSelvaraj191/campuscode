import { Box, Container } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import FacultySidebar from "../components/FacultySidebar";
import StudentSidebar from "../components/StudentSidebar";
import FacultyDashboard from "./Faculty/Dashboard";
import StudentDashboard from "./Student/Dashboard";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {role === "faculty" ? (
        <FacultySidebar collapsed={collapsed} onToggle={handleToggle} />
      ) : (
        <StudentSidebar collapsed={collapsed} onToggle={handleToggle} />
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: collapsed ? "72px" : "220px",
          transition: "margin-left 220ms ease",
          p: 4,
        }}
      >
        <Container maxWidth="lg" sx={{ px: 0 }}>
          {role === "faculty" ? <FacultyDashboard /> : <StudentDashboard />}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
