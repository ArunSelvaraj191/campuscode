import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Spinner from "./components/Spinner";

const Login = lazy(() => import("./modules/Login.jsx"));
const LandingPage = lazy(() => import("./modules/LandingPage.jsx"));
const ResetLogin = lazy(() => import("./modules/ResetLogin.jsx"));
const ResetPassword = lazy(() => import("./modules/ResetPassword.jsx"));
const Dashboard = lazy(() => import("./modules/Dashboard.jsx"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetLogin />} />
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          + <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
