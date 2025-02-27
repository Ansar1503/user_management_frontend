import "./App.css";
import AuthPage from "./pages/AuthPage";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/protectedAdminRoute";
import AdminDashboardUI from "./components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/todo"/>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<ProtectedRoute />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/dashboard" element={<AdminDashboardUI />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
