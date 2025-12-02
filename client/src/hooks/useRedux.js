import { useDispatch, useSelector } from "react-redux";

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => useAppSelector((state) => state.auth);
export const useDashboard = () => useAppSelector((state) => state.dashboard);
export const useBatches = () =>
  useAppSelector((state) => state.dashboard.batches);
export const useAssignments = () =>
  useAppSelector((state) => state.dashboard.assignments);
export const useSelectedBatch = () =>
  useAppSelector((state) => state.dashboard.selectedBatch);
export const useSelectedAssignment = () =>
  useAppSelector((state) => state.dashboard.selectedAssignment);
