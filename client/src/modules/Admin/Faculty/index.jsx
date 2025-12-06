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
import PageHeader from "../../../components/PageHeader.jsx";
import { deleteFaculty, fetchFaculty } from "../../../redux/slices";

export default function AdminFaculty() {
  const dispatch = useDispatch();
  const [faculties, setFaculties] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const meta = useSelector(
    (s) => s.faculty?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
  );
  const [page, setPage] = useState(meta.page - 1);
  const [rowsPerPage, setRowsPerPage] = useState(meta.limit);

  useEffect(() => {
    // Fetch faculty from server via Redux (1-based page)
    dispatch(fetchFaculty({ page: page + 1, limit: rowsPerPage }));
  }, []);

  // read faculty from redux store
  const storeFaculty = useSelector((s) => s.faculty?.list || []);

  useEffect(() => {
    // map store faculty into local display shape
    const mapped = storeFaculty.map((f) => ({
      id: f.id,
      name: f.user?.name || f.name || "",
      email: f.user?.email || f.email || "",
      department: f.department || "N/A",
      qualification: f.qualification || "N/A",
      joining_date: f.joining_date || null,
      status: f.status || "active",
    }));
    setFaculties(mapped);
  }, [storeFaculty]);

  useEffect(() => {
    // when meta changes, keep local pagination state in sync
    setPage((meta.page || 1) - 1);
    setRowsPerPage(meta.limit || 10);
  }, [meta.page, meta.limit]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchFaculty({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchFaculty({ page: 1, limit: newLimit }));
  };

  const handleDeleteClick = (facultyId) => {
    setSelectedFacultyId(facultyId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteFaculty(selectedFacultyId)).unwrap();
      setOpenDeleteDialog(false);
      setSelectedFacultyId(null);
      // Refresh the list
      dispatch(fetchFaculty({ page: page + 1, limit: rowsPerPage }));
    } catch (error) {
      console.error("Failed to delete faculty:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedFacultyId(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <PageHeader title="Faculty Management" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          // onClick={() => navigate(path.admin.CREATE_FACULTY)}
        >
          Add Faculty
        </Button>
      </Stack>

      <Paper>
        {faculties.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography>No faculty found.</Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faculties.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell>{f.id}</TableCell>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell>{f.department}</TableCell>
                    <TableCell>{f.qualification}</TableCell>
                    <TableCell>
                      {f.joining_date
                        ? new Date(f.joining_date).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            f.status === "active" ? "#c8e6c9" : "#ffcccc",
                          color: f.status === "active" ? "#2e7d32" : "#c62828",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {f.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(f.id)}
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
        <DialogTitle id="alert-dialog-title">Delete Faculty</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this faculty? This action cannot be
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
