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
import PageHeader from "../../../components/PageHeader.jsx";
import { path } from "../../../config/routes.js";
import { deleteStudent, fetchStudents } from "../../../redux/slices";

export default function Student() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const meta = useSelector(
    (s) => s.students?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
  );
  const [page, setPage] = useState(meta.page - 1);
  const [rowsPerPage, setRowsPerPage] = useState(meta.limit);

  useEffect(() => {
    // Fetch students from server via Redux (1-based page)
    dispatch(fetchStudents({ page: page + 1, limit: rowsPerPage }));
  }, []);

  // read students from redux store
  const storeStudents = useSelector((s) => s.students?.list || []);

  useEffect(() => {
    // map store students into local display shape
    const mapped = storeStudents.map((s) => ({
      id: s.id,
      name: s.user?.name || s.name || "",
      email: s.user?.email || s.email || "",
      batch: s.batch?.name || s.batchName || "N/A",
      enrollment_date: s.enrollment_date || s.enrollmentDate || null,
    }));
    setStudents(mapped);
  }, [storeStudents]);

  useEffect(() => {
    // when meta changes, keep local pagination state in sync
    setPage((meta.page || 1) - 1);
    setRowsPerPage(meta.limit || 10);
  }, [meta.page, meta.limit]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchStudents({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchStudents({ page: 1, limit: newLimit }));
  };

  const handleEditClick = (studentId) => {
    navigate(path.faculty.EDIT_STUDENT.replace(":id", studentId));
  };

  const handleDeleteClick = (studentId) => {
    setSelectedStudentId(studentId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteStudent(selectedStudentId)).unwrap();
      setOpenDeleteDialog(false);
      setSelectedStudentId(null);
      // Refresh the list
      dispatch(fetchStudents({ page: page + 1, limit: rowsPerPage }));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedStudentId(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <PageHeader title="Students" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(path.faculty.CREATE_STUDENT)}
        >
          Enroll Student
        </Button>
      </Stack>

      <Paper>
        {students.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No students found.</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Enrollment Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.batch}</TableCell>
                    <TableCell>
                      {s.enrollment_date
                        ? new Date(s.enrollment_date).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(s.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(s.id)}
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
        <DialogTitle id="alert-dialog-title">Delete Student</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this student? This action cannot be
            undone.
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
