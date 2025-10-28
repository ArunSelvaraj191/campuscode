import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

const ResetLogin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // wire up reset logic here
    console.log("Reset request submitted");
  };
  const navigate = useNavigate();
  const backToSignIn = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 360,
          borderRadius: 2,
          p: 4,
          boxShadow: (t) => `0 8px 30px ${t.palette.primary.main}14`,
        }}
      >
        <Typography variant="h6" align="center" sx={{ fontWeight: 800 }}>
          Reset Password
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 1, mb: 2 }}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            name="email"
            required
            fullWidth
            margin="normal"
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.25, fontWeight: 700 }}
          >
            Send Reset Link
          </Button>
        </Box>

        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Link
            href="#"
            onClick={backToSignIn}
            underline="hover"
            variant="body2"
            sx={{ fontWeight: 700, cursor: "pointer" }}
          >
            Back to Sign In
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ResetLogin;
