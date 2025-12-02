import { Box, Button, Card, CardContent, Typography } from "@mui/material";

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

const StudentDashboard = () => {
  const assignments = [
    { id: 1, title: "Python — Strings & Hashing", color: "primary" },
    { id: 2, title: "Java — Collections", color: "dark" },
  ];

  return (
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
  );
};

export default StudentDashboard;
