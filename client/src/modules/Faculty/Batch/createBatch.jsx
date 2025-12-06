import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { path } from "../../../config/routes";
import { createBatch, fetchBatch, updateBatch } from "../../../redux/slices";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  fontFamily: "Roboto, sans-serif",
  fontSize: "14px",
  padding: theme.spacing(1.5),
  paddingRight: theme.spacing(0),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

// Main Component - handles both create and edit
export default function BatchForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: "",
    graduationYear: "",
    courseDepartment: "",
    description: "",
  });

  // Fetch batch if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadBatch = async () => {
        try {
          const result = await dispatch(fetchBatch(id)).unwrap();
          if (result) {
            setFormData({
              name: result.name || "",
              graduationYear: result.graduation_year || "",
              courseDepartment: result.course_department || "",
              description: result.description || "",
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch batch:", error);
          setLoading(false);
        }
      };

      loadBatch();
    }
  }, [id, isEditMode, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert("Batch name is required");
      return;
    }
    if (!formData.graduationYear) {
      alert("Graduation year is required");
      return;
    }
    if (!formData.courseDepartment.trim()) {
      alert("Course/Department is required");
      return;
    }

    const payload = {
      name: formData.name,
      graduationYear: parseInt(formData.graduationYear, 10),
      courseDepartment: formData.courseDepartment,
      description: formData.description,
    };

    try {
      if (isEditMode) {
        await dispatch(updateBatch({ id, batchData: payload })).unwrap();
      } else {
        await dispatch(createBatch(payload)).unwrap();
      }
      navigate(path.faculty.BATCH);
    } catch (err) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} batch:`,
        err
      );
      alert(
        `Failed to ${isEditMode ? "update" : "create"} batch. Please try again.`
      );
    }
  };

  const handleCancel = () => {
    navigate(path.faculty.BATCH);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, margin: "0 auto" }}>
        <Typography>Loading batch...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <PageHeader
        title={isEditMode ? "Edit Batch" : "Create New Batch"}
        subtitle={
          isEditMode
            ? "Update the batch details."
            : "Fill in the details to create a new batch."
        }
        showUserInfo={false}
      />

      {/* Main Content */}
      <StyledPaper>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Batch Details
        </Typography>

        <Grid container spacing={3}>
          {/* Batch Name */}
          <Grid item size={12}>
            <TextField
              fullWidth
              label="Batch Name"
              name="name"
              placeholder="e.g., 2025 CS Major"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
          </Grid>

          {/* Graduation Year and Course/Department */}
          <Grid item size={6}>
            <TextField
              fullWidth
              label="Graduation Year"
              name="graduationYear"
              type="number"
              placeholder="Select year"
              value={formData.graduationYear}
              onChange={handleInputChange}
              variant="outlined"
              required
              inputProps={{ min: 2020, max: 2100 }}
            />
          </Grid>

          <Grid item size={6}>
            <TextField
              fullWidth
              label="Course/Department"
              name="courseDepartment"
              placeholder="e.g., Computer Science"
              value={formData.courseDepartment}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
          </Grid>

          {/* Description */}
          <Grid item size={12}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Description (Optional)
            </Typography>
            <StyledTextarea
              minRows={4}
              placeholder="Provide additional details about the batch..."
              value={formData.description}
              onChange={handleTextareaChange}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditMode ? "Update Batch" : "Create Batch"}
        </Button>
      </Box>
    </Box>
  );
}
