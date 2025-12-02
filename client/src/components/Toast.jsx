import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Toast = ({
  open,
  onClose,
  message = "",
  severity = "success",
  duration = 2000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={!!open}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
      autoHideDuration={duration}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
