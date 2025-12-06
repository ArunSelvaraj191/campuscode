import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { path } from "../../../config/routes.js";
import { deleteAssignment, fetchAssignments } from "../../../redux/slices";

export default function Assignment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const meta = useSelector(
    (s) =>
      s.assignments?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
  );
  const [page, setPage] = useState(meta.page - 1);
  const [rowsPerPage, setRowsPerPage] = useState(meta.limit);

  useEffect(() => {
    // Fetch assignments from server via Redux (1-based page)
    dispatch(fetchAssignments({ page: page + 1, limit: rowsPerPage }));
  }, []);

  // read assignments from redux store
  const storeAssignments = useSelector((s) => s.assignments?.list || []);

  useEffect(() => {
    // map store assignments into local display shape
    const mapped = storeAssignments.map((a) => ({
      id: a.id,
      title: a.title,
      batches: (a.batches || []).map((b) => b.name || b.id),
      dueDate: a.due_date || a.dueDate || null,
      gradeType: a.grading_type || a.gradeType || "Auto",
      totalMarks: a.total_marks || a.totalMarks || 0,
    }));
    setAssignments(mapped);
  }, [storeAssignments]);

  useEffect(() => {
    // when meta changes, keep local pagination state in sync
    setPage((meta.page || 1) - 1);
    setRowsPerPage(meta.limit || 10);
  }, [meta.page, meta.limit]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchAssignments({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchAssignments({ page: 1, limit: newLimit }));
  };

  const handleEditClick = (assignmentId) => {
    navigate(path.faculty.EDIT_ASSIGNMENT.replace(":id", assignmentId));
  };

  const handleDeleteClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteAssignment(selectedAssignmentId)).unwrap();
      setOpenDeleteDialog(false);
      setSelectedAssignmentId(null);
      // Refresh the list
      dispatch(fetchAssignments({ page: page + 1, limit: rowsPerPage }));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedAssignmentId(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Assignments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(path.faculty.CREATE_ASSIGNMENT)}
        >
          Create Assignment
        </Button>
      </Stack>

      <Paper>
        {assignments.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No assignments found.</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Batches</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Grading</TableCell>
                  <TableCell>Total Marks</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{a.batches.join(", ")}</TableCell>
                    <TableCell>
                      {a.dueDate
                        ? new Date(a.dueDate).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{a.gradeType}</TableCell>
                    <TableCell>{a.totalMarks}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(a.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(a.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={meta.total || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
