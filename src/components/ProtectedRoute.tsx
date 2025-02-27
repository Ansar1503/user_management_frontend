import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../Redux/Hook";
import Home from "../pages/Home";

function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.isBlocked) {
      navigate("/");
    }
  }, [user, navigate]);

  return <>{(user?.role === "user" || user?.role === "admin") && <Home />}</>;
}

export default ProtectedRoute;
