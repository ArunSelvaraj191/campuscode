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
import { deleteBatch, fetchBatches } from "../../../redux/slices";

export default function Batch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [batches, setBatches] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const meta = useSelector(
    (s) => s.batches?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
  );
  const [page, setPage] = useState(meta.page - 1);
  const [rowsPerPage, setRowsPerPage] = useState(meta.limit);

  useEffect(() => {
    // Fetch batches from server via Redux (1-based page)
    dispatch(fetchBatches({ page: 1, limit: 10 }));
  }, [dispatch]);

  // read batches from redux store
  const storeBatches = useSelector((s) => s.batches?.list || []);

  useEffect(() => {
    // map store batches into local display shape
    const mapped = storeBatches.map((b) => ({
      id: b.id,
      name: b.name,
      graduationYear: b.graduation_year || b.graduationYear,
      courseDepartment: b.course_department || b.courseDepartment,
      description: b.description || "",
      createdBy: b.creator?.name || "Unknown",
    }));
    setBatches(mapped);
  }, [storeBatches]);

  useEffect(() => {
    // when meta changes, keep local pagination state in sync
    setPage((meta.page || 1) - 1);
    setRowsPerPage(meta.limit || 10);
  }, [meta.page, meta.limit]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchBatches({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchBatches({ page: 1, limit: newLimit }));
  };

  const handleCreateClick = () => {
    navigate(path.faculty.CREATE_BATCH);
  };

  const handleEditClick = (batchId) => {
    navigate(path.faculty.EDIT_BATCH.replace(":id", batchId));
  };

  const handleDeleteClick = (batchId) => {
    setSelectedBatchId(batchId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteBatch(selectedBatchId)).unwrap();
      setOpenDeleteDialog(false);
      setSelectedBatchId(null);
      // Refresh the list
      dispatch(fetchBatches({ page: page + 1, limit: rowsPerPage }));
    } catch (error) {
      console.error("Failed to delete batch:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedBatchId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Batches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create Batch
        </Button>
      </Stack>

      {/* Table */}
      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Graduation Year</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Course/Department
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <TableRow key={batch.id} hover>
                  <TableCell>{batch.name}</TableCell>
                  <TableCell>{batch.graduationYear}</TableCell>
                  <TableCell>{batch.courseDepartment}</TableCell>
                  <TableCell>
                    {batch.description
                      ? batch.description.substring(0, 50) + "..."
                      : "-"}
                  </TableCell>
                  <TableCell>{batch.createdBy}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(batch.id)}
                        sx={{ color: "primary.main", mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(batch.id)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    No batches found. Create one to get started!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={meta.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Batch?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this batch? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
