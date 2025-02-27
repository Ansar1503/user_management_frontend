import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../Redux/Hook";

function ProtectedAdminRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.isBlocked) {
      navigate("/");
    } else if (user?.role == "user") {
      navigate("/home");
    }
  }, [user, navigate]);

  return <>{user?.role === "admin" && <Outlet />}</>;
}

export default ProtectedAdminRoute;
