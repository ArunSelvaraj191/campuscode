import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useRedux";
import { clearResetSuccess, requestPasswordReset } from "../redux/slices";

const ResetLogin = () => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, resetSuccess, resetMessage } = useAuth();
  console.log("ResetLogin ::", isLoading, resetSuccess);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email) {
      setLocalError("Email is required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    dispatch(requestPasswordReset(email));
  };

  const backToSignIn = (e) => {
    e.preventDefault();
    dispatch(clearResetSuccess());
    navigate("/login");
  };

  useEffect(() => {
    if (!resetSuccess) return;
    // show toast then navigate to login
    setOpenSnackbar(true);
  }, [resetSuccess, dispatch, navigate]);

  // Show success message
  if (resetSuccess) {
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
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Check Your Email
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {resetMessage ||
              "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={backToSignIn}
            sx={{ mt: 2, py: 1.25, fontWeight: 700 }}
          >
            Back to Sign In
          </Button>

          {/* Use shared Toast component */}
          <Toast
            open={openSnackbar}
            onClose={() => setOpenSnackbar(false)}
            message={resetMessage || "Password reset email sent successfully"}
            severity="success"
            duration={2000}
          />
        </Paper>
      </Box>
    );
  }

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
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoComplete="email"
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2, py: 1.25, fontWeight: 700 }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
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
