import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { path } from "../config/routes";
import { logout } from "../utils/auth";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after successful logout
      navigate(path.auth.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Button onClick={handleLogout} color="inherit">
      Logout
    </Button>
  );
};

export default LogoutButton;
