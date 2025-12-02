import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";

const FacultyDashboard = ({ onCreateAssignment }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <PageHeader
        title="Welcome back, Prof. Lee"
        subtitle="Overview of your courses, students and upcoming deadlines."
        userName="Prof. Lee"
        userInitials="PL"
        showUserInfo={true}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Active Batches", value: "12" },
          { label: "Pending Reviews", value: "34" },
          { label: "Avg Batch Score", value: "78%" },
          { label: "Student Counts", value: "80%" },
          { label: "Completed Assignments", value: "120" },
          { label: "Upcoming Events", value: "5" },
        ].map((c, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {b.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: 2,
              border: "1px solid rgba(15,23,42,0.04)",
              boxShadow: "0 2px 12px 0 rgba(44,62,80,0.10)",
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Assignments</Typography>
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
                  <Typography sx={{ fontWeight: 700 }}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {a.due} · Tests Passed: {a.passed}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

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
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onCreateAssignment}
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
            item
            xs={12}
            md={4}
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
    </Box>
  );
};

export default FacultyDashboard;
