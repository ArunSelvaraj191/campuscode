import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "";
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({ email: data.get("email"), password: data.get("password") });
  };
  const navigate = useNavigate();

  const handleForgot = (e) => {
    e.preventDefault();
    navigate("/reset");
  };

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
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            size="small"
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
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 1,
              py: 1.1,
              fontWeight: 700,
              background: "linear-gradient(180deg,#2b7cf9,#2370e6)",
            }}
          >
            Sign In
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
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
