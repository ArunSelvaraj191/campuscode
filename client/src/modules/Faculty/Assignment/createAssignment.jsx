import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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
import {
  createAssignment,
  fetchAssignment,
  updateAssignment,
} from "../../../redux/slices";

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
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

// Main Component - handles both create and edit
export default function AssignmentForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batches: [],
    autoGrading: "",
    gradeType: "Auto",
    totalMarks: "",
    releaseOption: "immediately",
    attachments: [],
  });

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);

  // Mock data - replace with actual API data
  const availableBatches = [
    { id: 1, name: "Batch A" },
    { id: 2, name: "Batch B" },
    { id: 3, name: "Batch C" },
  ];

  // Fetch assignment if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadAssignment = async () => {
        try {
          const result = await dispatch(fetchAssignment(id)).unwrap();
          if (result) {
            setFormData({
              title: result.title || "",
              description: result.description || "",
              batches: result.batches || [],
              autoGrading: result.auto_evaluation || "",
              gradeType: result.grading_type || "Auto",
              totalMarks: result.total_marks || "",
              releaseOption: result.release_option || "immediately",
              attachments: result.attachments || [],
            });
            setDueDate(result.due_date ? result.due_date.split("T")[0] : "");
            setDueTime(result.start_time || "");
            setDuration(result.duration_mins || "");

            const batchNames = (result.batches || []).map((b) => b.name);
            setSelectedBatches(batchNames);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch assignment:", error);
          setLoading(false);
        }
      };

      loadAssignment();
    }
  }, [id, isEditMode, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setDueTime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleBatchSelect = (event) => {
    const { value } = event.target;
    setSelectedBatches(typeof value === "string" ? value.split(",") : value);
    setFormData((prev) => ({
      ...prev,
      batches: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const preparePayload = () => {
    const assignedBatchIds = availableBatches
      .filter((b) => selectedBatches.includes(b.name))
      .map((b) => b.id);

    return {
      title: formData.title,
      description: formData.description,
      assigned_batches: assignedBatchIds,
      auto_evaluation: formData.autoGrading,
      due_date: dueDate,
      start_time: dueTime,
      duration_mins: duration,
      grading_type: formData.gradeType,
      total_marks: formData.totalMarks,
      release_option: formData.releaseOption,
      attachments: formData.attachments
        .filter((f) => typeof f === "string")
        .concat(
          formData.attachments
            .filter((f) => typeof f !== "string")
            .map((f) => f.name)
        ),
    };
  };

  const handleSubmit = async () => {
    console.log(`${isEditMode ? "Updating" : "Creating"} assignment:`, {
      ...formData,
      dueDate,
      dueTime,
      duration,
    });

    const payload = preparePayload();

    try {
      if (isEditMode) {
        await dispatch(
          updateAssignment({ id, assignmentData: payload })
        ).unwrap();
      } else {
        await dispatch(createAssignment(payload)).unwrap();
      }
      navigate(path.faculty.ASSIGNMENT);
    } catch (err) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} assignment:`,
        err
      );
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(path.faculty.ASSIGNMENT);
    } else {
      setFormData({
        title: "",
        description: "",
        batches: [],
        autoGrading: "",
        gradeType: "Auto",
        totalMarks: "",
        releaseOption: "immediately",
        attachments: [],
      });
      setDueDate("");
      setDueTime("");
      setDuration("");
      setSelectedBatches([]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}>
        <Typography>Loading assignment...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <PageHeader
        title={isEditMode ? "Edit Assignment" : "Create Assignment"}
        subtitle={
          isEditMode
            ? "Update the assignment details, attachments and settings."
            : "Define the assignment details, attach test cases and assign to batches."
        }
        showUserInfo={false}
      />

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Assignment Details & Settings */}
        <Grid item size={{ xs: 12, md: 8 }}>
          {/* Assignment Details Section */}
          <StyledPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Assignment Details
            </Typography>

            {/* Title */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="e.g., DSA – Array Practice"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Description
              </Typography>
              <StyledTextarea
                minRows={4}
                placeholder="Brief instructions or problem statement..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Box>

            {/* Attachments */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Attachments
              </Typography>
              <UploadBox component="label">
                <input
                  hidden
                  accept="*/*"
                  multiple
                  type="file"
                  onChange={handleFileUpload}
                />
                <CloudUploadIcon
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="body2">
                  Upload test files, problem PDF (optional)
                </Typography>
                <Button
                  size="small"
                  sx={{
                    color: "primary.main",
                    textTransform: "none",
                    mt: 1,
                  }}
                >
                  Upload
                </Button>
              </UploadBox>

              {/* Uploaded Files List */}
              {formData.attachments.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap" }}
                >
                  {formData.attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={typeof file === "string" ? file : file.name}
                      onDelete={() => removeAttachment(index)}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Box>

            {/* Auto-evaluation */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Auto-evaluation
              </Typography>
              <StyledTextarea
                minRows={3}
                placeholder="Add test cases or attach test suite (Markdown format)"
                value={formData.autoGrading}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    autoGrading: e.target.value,
                  }))
                }
              />
            </Box>
          </StyledPaper>

          {/* Due Date & Time Section */}
          <StyledPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Due Date & Time
            </Typography>

            <Grid container spacing={2}>
              {/* Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Select date"
                  value={dueDate}
                  onChange={handleDateChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Time */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="HH:MM"
                  value={dueTime}
                  onChange={handleTimeChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Duration */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (mins)"
                  placeholder="0"
                  value={duration}
                  onChange={handleDurationChange}
                  variant="outlined"
                  inputProps={{ min: "0" }}
                />
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Right Column - Publish Settings */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Publish Settings
            </Typography>

            {/* Assign to Batch */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Assign to Batch</InputLabel>
                <Select
                  multiple
                  value={selectedBatches}
                  onChange={handleBatchSelect}
                  label="Assign to Batch"
                  placeholder="Select one or more batches"
                  renderValue={(selected) => selected.join(", ")}
                >
                  {availableBatches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.name}>
                      <Checkbox
                        checked={selectedBatches.indexOf(batch.name) > -1}
                      />
                      {batch.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select one or more batches</FormHelperText>
              </FormControl>
            </Box>

            {/* Visibility */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Visibility"
                placeholder="Students in selected batches"
                disabled
                variant="outlined"
              />
              <FormHelperText sx={{ color: "text.secondary" }}>
                Students in selected batches
              </FormHelperText>
            </Box>

            {/* Grading */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Grading
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.gradeType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gradeType: e.target.value,
                        }))
                      }
                      displayEmpty
                    >
                      <MenuItem value="Auto">Auto / Manual</MenuItem>
                      <MenuItem value="Auto">Auto</MenuItem>
                      <MenuItem value="Manual">Manual</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total Marks"
                    placeholder="0"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    name="totalMarks"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Release Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Release Options
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.releaseOption}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      releaseOption: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="immediately">Publish Immediately</MenuItem>
                  <MenuItem value="schedule">Schedule</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Preview Section */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                Preview
              </Typography>
              <PreviewCard>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {formData.title || "Assignment Title"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Due: {dueDate ? new Date(dueDate).toLocaleDateString() : ""}{" "}
                    {dueTime ? dueTime : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Grading: {formData.gradeType}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Total marks: {formData.totalMarks || ""}
                  </Typography>
                </CardContent>
              </PreviewCard>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditMode ? "Update Assignment" : "Create Assignment"}
        </Button>
      </Box>
    </Box>
  );
}
