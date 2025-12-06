import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "../../../components/PageHeader.jsx";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Faculty",
      value: "12",
      color: "#1565c0",
    },
    {
      label: "Total Students",
      value: "245",
      color: "#00897b",
    },
    {
      label: "Total Batches",
      value: "8",
      color: "#f57c00",
    },
    {
      label: "Active Assignments",
      value: "18",
      color: "#c62828",
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Admin Dashboard" />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                borderLeft: `4px solid ${stat.color}`,
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: stat.color }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Activities
        </Typography>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              borderLeft: "4px solid #1565c0",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              New Faculty Added
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dr. Arun Kumar added to Computer Science department
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              borderLeft: "4px solid #00897b",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Batch Created
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Batch 2025-CS created with 50 students
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              borderLeft: "4px solid #f57c00",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Assignment Released
            </Typography>
            <Typography variant="caption" color="text.secondary">
              "DSA Challenge Round 1" assigned to Batch 2025-CS
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
