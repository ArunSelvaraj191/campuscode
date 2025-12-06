import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import CampusCodeIcon from "../components/CampusCodeIcon";
import { path } from "../config/routes";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    if (type) {
      navigate(path.auth.LOGIN, {
        state: {
          type,
        },
      });
    }
  };

  return (
    <Box
      component="section"
      sx={{ minHeight: "100vh", bgcolor: "background.paper", pb: 6 }}
    >
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CampusCodeIcon size={16} color="primary.main" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            CampusCode
          </Typography>
        </Stack>

        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, lineHeight: 1.05 }}
          >
            Ace Your Placement Coding Rounds
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 700 }}
          >
            Practice, take assessments, and get instant feedback—built for
            colleges.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNavigate("student")}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.25,
                boxShadow: (t) => `0 6px 18px ${t.palette.primary.main}28`,
              }}
            >
              Student Login
            </Button>
            <Button
              variant="contained"
              onClick={() => handleNavigate("faculty")}
              sx={{
                bgcolor: "#111",
                color: "#fff",
                borderRadius: 2,
                px: 3,
                py: 1.25,
                "&:hover": { bgcolor: "#0d0d0d" },
              }}
            >
              Faculty Login
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mt: 4 }}
          >
            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                bgcolor: "background.default",
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Real-time Evaluation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Run code, validate test cases, score instantly.
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                bgcolor: "background.default",
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Batch Management
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Organize by graduation year, assign challenges.
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                bgcolor: "background.default",
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Email Reminders
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Automated 24h and 1h deadline alerts.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Container>

      <Box component="footer" sx={{ mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="caption" color="text.secondary">
            © 2025 CampusCode - Terms · Privacy
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
