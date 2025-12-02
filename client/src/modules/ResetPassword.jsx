import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import { path } from "../config/routes";
import { useAuth } from "../hooks/useRedux";
import { resetPassword, verifyResetToken } from "../redux/slices";

const ResetPassword = () => {
  const { token } = useParams();
  console.log("Token :::", token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, resetSuccess } = useAuth();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setLocalError("No reset token provided.");
      setTokenValid(false);
      return;
    }

    // Verify the token
    dispatch(verifyResetToken(token));
    setTokenValid(true);
  }, [token, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setLocalError("Both password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // Submit the password reset
    dispatch(resetPassword({ token, newPassword }));
  };

  const backToSignIn = (e) => {
    e.preventDefault();
    navigate(path.auth.LOGIN);
  };

  useEffect(() => {
    if (!resetSuccess) return;
    setOpenSnackbar(true);
  }, [resetSuccess, dispatch, navigate]);

  // Show loading state while verifying token
  if (tokenValid === null) {
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
          sx={{ width: 360, borderRadius: 2, p: 4, textAlign: "center" }}
        >
          <Typography variant="body2">Verifying reset token...</Typography>
        </Paper>
      </Box>
    );
  }

  // Show error if token is invalid
  if (!tokenValid || error) {
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
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, mb: 2, color: "#d32f2f" }}
          >
            Invalid or Expired Link
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This password reset link has expired or is invalid. Please request a
            new one.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={backToSignIn}
            sx={{ mt: 2, py: 1.25, fontWeight: 700 }}
          >
            Request New Reset Link
          </Button>
        </Paper>
      </Box>
    );
  }

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
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, mb: 2, color: "#2e7d32" }}
          >
            Password Reset Successful
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your password has been reset successfully. You can now sign in with
            your new password.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={backToSignIn}
            sx={{ mt: 2, py: 1.25, fontWeight: 700 }}
          >
            Go to Sign In
          </Button>

          {/* Use shared Toast component */}
          <Toast
            open={openSnackbar}
            onClose={() => setOpenSnackbar(false)}
            message="Password reset successful"
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
          Create New Password
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 1, mb: 2 }}
        >
          Enter a new password to reset your account.
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
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            disabled={isLoading}
            helperText="At least 6 characters"
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
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
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
