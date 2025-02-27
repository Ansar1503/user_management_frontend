import React from "react";
import { FaUser } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../Redux/Hook";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../Redux/Auth/AuthSlice";

const Navbar: React.FC = () => {
  const user: any = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-sm px-6 py-3 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-52 w-2/3">
          <div className="mr-10"></div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-600">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  className="w-full h-full object-cover"
                  alt="User Avatar"
                />
              ) : (
                <FaUser className="text-white" />
              )}
            </div>

            <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg opacity-0 transform scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-in-out z-20">
              <ul>
                <li className="px-4  py-2 text-sm font-semibold text-gray-300 border-b border-gray-600">
                  {user.fname || "Username"}
                </li>

                {user.role === "admin" && location.pathname == "/home" ? (
                  <li
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 hover:text-white rounded-md transition-all duration-150"
                  >
                    Dashboard
                  </li>
                ) : (
                  <li
                    onClick={() => navigate("/home")}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 hover:text-white rounded-md transition-all duration-150"
                  >
                    Home
                  </li>
                )}

                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 hover:text-white rounded-md transition-all duration-150"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
