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
const StudentLayout = lazy(() => import("./modules/Student/StudentLayout.jsx"));
const FacultyDashboard = lazy(() => import("./modules/Faculty/Dashboard"));
const CreateAssignment = lazy(() => import("./modules/Faculty/Assignment"));
const StudentDashboard = lazy(() => import("./modules/Student/Dashboard"));

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
            <Route
              path={path.faculty.CREATE_ASSIGNMENT}
              element={<CreateAssignment />}
            />
          </Route>
          {/* Student Routes with Layout */}
          <Route
            path={routes.BASE_sTUDENT}
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
