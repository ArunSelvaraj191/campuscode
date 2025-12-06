import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import { path, routes } from "./config/routes.js";

const Login = lazy(() => import("./modules/Login.jsx"));
const LandingPage = lazy(() => import("./modules/LandingPage.jsx"));
const ResetLogin = lazy(() => import("./modules/ResetLogin.jsx"));
const ResetPassword = lazy(() => import("./modules/ResetPassword.jsx"));
const FacultyLayout = lazy(() => import("./modules/Faculty/FacultyLayout.jsx"));
const AdminLayout = lazy(() => import("./modules/Admin/AdminLayout.jsx"));
const StudentLayout = lazy(() => import("./modules/Student/StudentLayout.jsx"));
const FacultyDashboard = lazy(() => import("./modules/Faculty/Dashboard"));
const Assignment = lazy(() => import("./modules/Faculty/Assignment"));
const AssignmentForm = lazy(() =>
  import("./modules/Faculty/Assignment/CreateAssignment.jsx")
);
const StudentDashboard = lazy(() => import("./modules/Student/Dashboard"));
const Batch = lazy(() => import("./modules/Faculty/Batch"));
const BatchForm = lazy(() => import("./modules/Faculty/Batch/createBatch.jsx"));
const Student = lazy(() => import("./modules/Faculty/Student"));
const StudentForm = lazy(() =>
  import("./modules/Faculty/Student/CreateStudent.jsx")
);
const AdminDashboard = lazy(() => import("./modules/Admin/Dashboard"));
const AdminFaculty = lazy(() => import("./modules/Admin/Faculty"));
const AdminSettings = lazy(() => import("./modules/Admin/Settings"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path={path.auth.LOGIN} element={<Login />} />
          <Route path={path.auth.RESET} element={<ResetLogin />} />
          <Route path={path.auth.RESET_PASSWORD} element={<ResetPassword />} />
          {/* Faculty Routes with Layout */}
          <Route
            path={routes.BASE_FACULTY}
            element={
              <ProtectedRoute allowedRoles={"faculty"}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path={path.faculty.DASHBOARD}
              element={<FacultyDashboard />}
            />
            <Route path={path.faculty.ASSIGNMENT} element={<Assignment />} />
            <Route
              path={path.faculty.CREATE_ASSIGNMENT}
              element={<AssignmentForm />}
            />
            <Route
              path={path.faculty.EDIT_ASSIGNMENT}
              element={<AssignmentForm />}
            />
            <Route path={path.faculty.BATCH} element={<Batch />} />
            <Route path={path.faculty.CREATE_BATCH} element={<BatchForm />} />
            <Route path={path.faculty.EDIT_BATCH} element={<BatchForm />} />
            <Route path={path.faculty.STUDENT} element={<Student />} />
            <Route
              path={path.faculty.CREATE_STUDENT}
              element={<StudentForm />}
            />
            <Route path={path.faculty.EDIT_STUDENT} element={<StudentForm />} />
          </Route>
          {/* Admin Routes with Layout */}
          <Route
            path={routes.BASE_ADMIN}
            element={
              <ProtectedRoute allowedRoles={"admin"}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={path.admin.DASHBOARD} element={<AdminDashboard />} />
            <Route path={path.admin.FACULTY} element={<AdminFaculty />} />
            <Route path={path.admin.SETTINGS} element={<AdminSettings />} />
          </Route>
          {/* Student Routes with Layout */}
          <Route
            path={routes.BASE_STUDENT}
            element={
              <ProtectedRoute allowedRoles={"student"}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path={path.student.DASHBOARD}
              element={<StudentDashboard />}
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
