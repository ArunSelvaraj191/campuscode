import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import BookIcon from "@mui/icons-material/Book";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { path } from "../config/routes";
import { logoutUser } from "../redux/slices";
import CampusCodeIcon from "./CampusCodeIcon";

const FacultySidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: path.faculty.DASHBOARD,
      icon: <DashboardIcon />,
    },
    { key: "batches", label: "Batches", icon: <BarChartIcon /> },
    {
      key: "assignments",
      label: "Assignments",
      path: path.faculty.CREATE_ASSIGNMENT,
      icon: <AssignmentIcon />,
    },
    { key: "students", label: "Students", icon: <GroupIcon /> },
    { key: "library", label: "Library", icon: <BookIcon /> },
    { key: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 220,
        transition: "width 220ms ease",
        minHeight: "100vh",
        bgcolor: "#0f1724",
        color: "#e6eef8",
        px: collapsed ? 1 : 2.5,
        py: 1.25,
        position: "fixed",
        left: 0,
        top: 0,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          pr: collapsed ? 1.5 : 1,
        }}
      >
        <Tooltip title={collapsed ? "Open" : "Collapse"}>
          <IconButton onClick={onToggle} size="small" sx={{ color: "#cbd5e1" }}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ position: "relative", mb: 2, mt: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ pl: collapsed ? 2 : 0 }}
        >
          <CampusCodeIcon size={16} color="primary.main" />
          {!collapsed && (
            <Typography sx={{ fontWeight: 800 }}>CampusCode</Typography>
          )}
        </Stack>
      </Box>

      <List sx={{ mt: 1 }}>
        {menu.map((m) => (
          <Tooltip
            key={m.key}
            title={collapsed ? m.label : ""}
            placement="right"
            arrow
            disableHoverListener={!collapsed}
          >
            <ListItem
              button
              onClick={() => handleMenuClick(m.path)}
              sx={{
                py: 1.25,
                borderRadius: 1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "#cbd5e1" }}>
                {m.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={m.label} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          px: collapsed ? 1 : 2.5,
        }}
      >
        <Divider sx={{ mb: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />
        <Tooltip
          title={collapsed ? "Logout" : ""}
          placement="right"
          arrow
          disableHoverListener={!collapsed}
        >
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              py: 1.25,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              color: "#ef5350",
              "&:hover": { bgcolor: "rgba(239,83,80,0.1)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#ef5350" }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default FacultySidebar;
