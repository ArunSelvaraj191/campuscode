import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  Button,
  Avatar,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const OverviewCard = ({ children }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: "none",
      border: "1px solid rgba(15,23,42,0.06)",
    }}
  >
    <CardContent sx={{ p: 2.25 }}>{children}</CardContent>
  </Card>
);

const GridContainer = () => (
  <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
    <OverviewCard>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Upcoming Deadlines
      </Typography>
      <Typography variant="body2" color="text.secondary">
        • DSA Arrays — due Aug 30, 6 PM
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        • Java OOP — due Sep 2, 11 AM
      </Typography>
    </OverviewCard>

    <OverviewCard>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Batch Activity
      </Typography>
      <Typography variant="body2" color="text.secondary">
        200 students - 18 active tests this week
      </Typography>
    </OverviewCard>
  </Box>
);

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  const assignments = [
    { id: 1, title: "Python — Strings & Hashing", color: "primary" },
    { id: 2, title: "Java — Collections", color: "dark" },
  ];

  const handleToggle = () => setCollapsed((c) => !c);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />

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
          {role === "faculty" ? (
            <>
              {/* Top header bar */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid rgba(15,23,42,0.04)",
                  bgcolor: "background.paper",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Faculty Dashboard
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Hi, Prof. Lee
                  </Typography>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "grey.100",
                      color: "text.primary",
                    }}
                  >
                    PL
                  </Avatar>
                </Stack>
              </Paper>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 0.5,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                }}
              >
                Welcome back, Prof. Lee
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Overview of your courses, students and upcoming deadlines.
              </Typography>
              {/* Top stat cards */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                  { label: "Active Batches", value: "12" },
                  { label: "Pending Reviews", value: "34" },
                  { label: "Avg Batch Score", value: "78%" },
                  { label: "Student Counts", value: "80%" },
                  { label: "Completed Assignments", value: "120" },
                  { label: "Upcoming Events", value: "5" },
                ].map((c, index) => (
                  <Grid size={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.25,
                        borderRadius: 2,
                        minHeight: 96,
                        border: "1px solid rgba(15,23,42,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        boxShadow: "0 2px 12px 0 rgba(44,62,80,0.10)",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {c.label}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 900, mt: 0.5, fontSize: "1.75rem" }}
                      >
                        {c.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              {/* Main columns: Batch Activity + Assignments */}
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 2,
                      border: "1px solid rgba(15,23,42,0.04)",
                      boxShadow: "0 2px 12px 0 rgba(44,62,80,0.10)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                      Batch Activity
                    </Typography>
                    <Stack spacing={1.25}>
                      {[
                        { title: "DSA - Batch A", students: 42, avg: "81%" },
                        { title: "Java - Batch B", students: 36, avg: "74%" },
                        { title: "Python - Batch C", students: 58, avg: "84%" },
                      ].map((b) => (
                        <Paper
                          key={b.title}
                          elevation={0}
                          sx={{
                            p: 1.25,
                            borderRadius: 1.5,
                            bgcolor: "rgba(15,23,42,0.02)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography sx={{ fontWeight: 700 }}>
                                {b.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Students: {b.students}
                              </Typography>
                            </Box>
                            <Typography
                              color="success.main"
                              sx={{ fontWeight: 700 }}
                            >{`Avg: ${b.avg}`}</Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 2,
                      border: "1px solid rgba(15,23,42,0.04)",
                      boxShadow: "0 2px 12px 0 rgba(44,62,80,0.10)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                      Assignments
                    </Typography>
                    <Stack spacing={1}>
                      {[
                        {
                          title: "DSA: Arrays",
                          due: "Aug 30, 2025",
                          passed: "6/10",
                        },
                        {
                          title: "Java OOP: Interfaces",
                          due: "Sep 02, 2025",
                          passed: "4/8",
                        },
                        {
                          title: "Python: Strings & Hashing",
                          due: "Sep 08, 2025",
                          passed: "9/12",
                        },
                      ].map((a) => (
                        <Paper
                          key={a.title}
                          elevation={0}
                          sx={{
                            bgcolor: "rgba(15,23,42,0.02)",
                            p: 1.25,
                            borderRadius: 2,
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {a.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due: {a.due} · Tests Passed: {a.passed}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
              {/* Bottom quick actions and engagement */}
              <Paper
                sx={{
                  mt: 3,
                  p: 2.25,
                  borderRadius: 2,
                  border: "1px solid rgba(15,23,42,0.04)",
                }}
                elevation={0}
              >
                <Grid container alignItems="center">
                  <Grid size={8}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 3,
                          background: "linear-gradient(180deg,#2b7cf9,#2370e6)",
                        }}
                      >
                        Create Assignment
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none", borderRadius: 2 }}
                      >
                        Export Report
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid
                    size={4}
                    sx={{
                      textAlign: { xs: "left", md: "right" },
                      mt: { xs: 2, md: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">Engagement</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          Active students: 136{" "}
                        </Typography>
                      </Box>
                      <Box
                        component="span"
                        sx={{ color: "success.main", fontWeight: 700, ml: 1 }}
                      >
                        +4.2%
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ mt: 3, fontWeight: 800 }}>
                Overview
              </Typography>

              <GridContainer />

              <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 700 }}>
                Assignments
              </Typography>

              <Box>
                {assignments.map((a) => (
                  <Box
                    key={a.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid rgba(15,23,42,0.06)",
                      borderRadius: 1,
                      p: 1.5,
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>{a.title}</Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          a.color === "primary"
                            ? "linear-gradient(180deg,#2b7cf9,#2370e6)"
                            : "#0b1220",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    >
                      Start / Continue
                    </Button>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
