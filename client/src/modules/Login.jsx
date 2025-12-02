import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useAuthActions } from "../hooks/useSagaActions";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useRedux";
import { clearError, loginUser } from "../redux/slices";
const Login = () => {
  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };
  const location = useLocation();
  // const params = new URLSearchParams(location.search);
  const role = location?.state?.type || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Saga actions
  const { isLoading, error, isAuthenticated } = useAuth();

  console.log("isAuthenticated ::", isAuthenticated);

  // Local state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  // const isAuthenticated = !!localStorage.getItem("token");

  // Redirect on successful login
  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    dispatch(clearError());
    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    } else {
      setLocalError("");
      console.log("Details :::", email, password);
      dispatch(loginUser({ email, password, role }));
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    navigate("/reset");
  };

  if (isAuthenticated) {
    return <div>Redirecting to dashboard...</div>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#f5f6f8" : "#071024",
        // p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: 360,
          borderRadius: 2,
          px: 4,
          py: 3.5,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to your account
          </Typography>
          {role ? (
            <Chip
              label={role === "student" ? "Student" : "Faculty"}
              size="small"
              color="primary"
              sx={{ mt: 1, fontWeight: 700 }}
            />
          ) : null}
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {(localError || error) && (
            <Typography
              variant="body2"
              sx={{
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {localError || error}
            </Typography>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            size="small"
            disabled={isLoading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            size="small"
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
              mb: 1,
              py: 1.1,
              fontWeight: 700,
              background: "linear-gradient(180deg,#2b7cf9,#2370e6)",
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 1.5 }}>
          <Link
            href="#"
            underline="always"
            sx={{ fontWeight: 700 }}
            onClick={handleForgot}
          >
            Forget Password?
          </Link>
          <br />
          <Button
            variant="text"
            onClick={handleBack}
            sx={{ mt: 1, fontWeight: 700 }}
            fullWidth
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
