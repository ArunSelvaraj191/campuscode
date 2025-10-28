import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";
import CampusCodeIcon from "./CampusCodeIcon";

const Sidebar = ({ collapsed, onToggle }) => {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { key: "assignments", label: "Assignments", icon: <AssignmentIcon /> },
    { key: "library", label: "Library", icon: <BookIcon /> },
    { key: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

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
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: "#cbd5e1",
              "&:focus": { outline: "none", boxShadow: "none", border: "none" },
              "&:active": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
              "&:hover": { outline: "none", boxShadow: "none", border: "none" },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Second row: logo / brand */}
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
              sx={{
                py: 1.25,
                borderRadius: 1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                "&:focus": { outline: "none" }, // Remove focus border
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
    </Box>
  );
};

export default Sidebar;
