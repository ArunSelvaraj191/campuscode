import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader.jsx";
import Toast from "../../../components/Toast.jsx";
import { path } from "../../../config/routes.js";
import {
  createStudent,
  fetchBatches,
  fetchStudent,
  updateStudent,
} from "../../../redux/slices";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

// Main Component - handles both create and edit
export default function CreateStudent() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(isEditMode);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batch_id: "",
  });

  const batches = useSelector((s) => s.batches?.list || []);
  const isSubmitting = useSelector((s) => s.students?.isLoading || false);
  const createSuccess = useSelector((s) => s.students?.createSuccess || false);
  const error = useSelector((s) => s.students?.error);

  // Fetch batches on mount
  useEffect(() => {
    dispatch(fetchBatches({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Fetch student if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchStudent(id))
        .unwrap()
        .then((data) => {
          setFormData({
            name: data.user?.name || data.name || "",
            email: data.user?.email || data.email || "",
            batch_id: data.batch_id || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          setToastMessage("Failed to load student");
          setToastSeverity("error");
          setToastOpen(true);
          setLoading(false);
        });
    }
  }, [id, isEditMode, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.batch_id) {
      setToastMessage("Please fill in all required fields");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateStudent({ id, studentData: formData })).unwrap();
        setToastMessage("Student updated successfully");
      } else {
        await dispatch(createStudent(formData)).unwrap();
        setToastMessage("Student enrolled successfully");
      }
      setToastSeverity("success");
      setToastOpen(true);
      setTimeout(() => {
        navigate(path.faculty.STUDENT);
      }, 1500);
    } catch (err) {
      setToastMessage(err || "Failed to save student");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  const handleCancel = () => {
    navigate(path.faculty.STUDENT);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title={isEditMode ? "Edit Student" : "Enroll Students"} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StyledPaper>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {isEditMode ? "Edit Student Details" : "Enrollment Options"}
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Student Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            fullWidth
            required
            size="small"
            variant="outlined"
          />

          <TextField
            label="Email ID"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="student@example.com"
            fullWidth
            required
            size="small"
            variant="outlined"
          />

          <TextField
            label="Assign to Batch"
            name="batch_id"
            value={formData.batch_id}
            onChange={handleInputChange}
            select
            fullWidth
            required
            size="small"
            variant="outlined"
          >
            <MenuItem value="">Select a batch</MenuItem>
            {batches.map((batch) => (
              <MenuItem key={batch.id} value={batch.id}>
                {batch.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} />
                {isEditMode ? "Updating..." : "Enrolling..."}
              </>
            ) : isEditMode ? (
              "Update Student"
            ) : (
              "Enroll Students"
            )}
          </Button>
        </Stack>
      </StyledPaper>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        severity={toastSeverity}
      />
    </Box>
  );
}
