import {
  Edit,
  Trash2,
  Ban,
  Search,
  User,
  ChevronDown,
  UnlockKeyhole,
  PlusCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useEffect, useState } from "react";
import {
  deleteUser,
  editUserDetails,
  getUsersData,
} from "../Redux/Admin/admin.thunk";
import { useAppDispatch, useAppSelector } from "../Redux/Hook";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import EditUserModal from "./editUser";
import CreateUserModal from "./CreateUserModal";
import ViewUserModal from "./Viewuserdetails";

export default function AdminDashboardUI() {
  const users = useAppSelector((state) => state.admin.users);
  const stateuser = useAppSelector((state) => {
    return state.auth.user?.role == "admin" ? state.auth.user : "";
  });

  const error = useAppSelector((state) => state.admin.error);
  // console.log(users);
  const dispatch = useAppDispatch();
  const [editModal, setEditModal] = useState({
    open: false,
    id: "",
  });
  const [createModal, setCreateModal] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState({
    open: false,
    id: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: "",
    userName: "",
  });

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    sortBy: "fname",
    sortOrder: "asc",
    searchQuery: "",
  });
  console.log("filters", filters);
  useEffect(() => {
    setEditModal({ open: false, id: "" });
    getUsers();
  }, [filters]);

  async function handleuserBlocking(block: boolean, id: string, email: string) {
    const result = await dispatch(
      editUserDetails({ isBlocked: block, email, _id: id })
    );
    if (editUserDetails.fulfilled.match(result)) {
    } else {
      toast.error(String(result.payload) || "Failed to fetch user details");
    }
  }

  async function getUsers() {
    const response = await dispatch(getUsersData(filters));

    if (getUsersData.fulfilled.match(response)) {
      console.log(response);
    } else {
      console.log(response);
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSortOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: e.target.value,
    }));
  };

  const handleDeleteUser = async () => {
    const result = await dispatch(deleteUser(deleteDialog.userId));

    if (deleteUser.fulfilled.match(result)) {
      toast.success("User deleted successfully");
    } else {
      toast.error("Failed to delete user");
    }

    setDeleteDialog({ isOpen: false, userId: "", userName: "" });
  };

  const openDeleteDialog = (userId: string, userName: string) => {
    setDeleteDialog({
      isOpen: true,
      userId,
      userName,
    });
  };

  return (
    <>
      <Navbar />
      {editModal.open && (
        <EditUserModal setEditModal={setEditModal} editModal={editModal} />
      )}
      {createModal && <CreateUserModal setCreateModal={setCreateModal} />}
      {isViewModalOpen.open && (
        <ViewUserModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen({ open: false, id: "" })}
        />
      )}
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mt-24 mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
          <button
            onClick={() => setCreateModal(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusCircle size={18} className="mr-1" />{" "}
            <span className="mr-1">Create User</span>
          </button>
          <AlertDialog
            open={deleteDialog.isOpen}
            onOpenChange={(isOpen) =>
              setDeleteDialog((prev) => ({ ...prev, isOpen }))
            }
          >
            <AlertDialogContent className="bg-gray-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {deleteDialog.userName}? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className=" bg-red-700 hover:bg-red-800"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <input
                onChange={handleSearchChange}
                value={filters.searchQuery}
                name="searchQuery"
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 p-2 rounded-md bg-gray-800 text-white border border-gray-600"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            <div className="relative">
              <select
                onChange={handleFilterChange}
                name="role"
                value={filters.role}
                className="w-[180px] p-2 rounded-md bg-gray-800 text-white border border-gray-600 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400"
                size={16}
              />
            </div>

            <div className="relative">
              <select
                onChange={handleFilterChange}
                name="status"
                value={filters.status}
                className="w-[180px] p-2 rounded-md bg-gray-800 text-white border border-gray-600 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400"
                size={16}
              />
            </div>

            <div className="relative">
              <select
                onChange={handleSortOptions}
                value={filters.sortBy}
                name="sortBy"
                className="w-[180px] p-2 rounded-md bg-gray-800 text-white border border-gray-600 appearance-none"
              >
                <option value="fname">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="status">Sort by Status</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400"
                size={16}
              />
            </div>

            <div className="relative">
              <select
                onChange={toggleSortOrder}
                value={filters.sortOrder}
                name="sortOrder"
                className="w-[180px] p-2 rounded-md bg-gray-800 text-white border border-gray-600 appearance-none"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400"
                size={16}
              />
            </div>

            <button
              onClick={() => {
                setFilters({
                  role: "",
                  searchQuery: "",
                  sortBy: "fname",
                  sortOrder: "asc",
                  status: "",
                });
              }}
              className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            >
              Reset Filters
            </button>
          </div>

          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-white">Name</th>
                  <th className="py-3 px-4 text-left text-white">Email</th>
                  <th className="py-3 px-4 text-left text-white">Phone</th>
                  <th className="py-3 px-4 text-left text-white">
                    Date of Birth
                  </th>
                  <th className="py-3 px-4 text-left text-white">Status</th>
                  <th className="py-3 px-4 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-lg text-center text-red-500"
                    >
                      Users not found
                    </td>
                  </tr>
                ) : (
                  users &&
                  users
                    ?.filter(
                      (user) =>
                        stateuser?._id &&
                        user._id?.toString() !== stateuser._id?.toString()
                    )
                    .map((user) => (
                      <tr key={user._id} className="border-b border-gray-700">
                        <td className="py-3 px-4 text-white">
                          <div
                            onClick={() => {
                              setIsViewModalOpen({
                                open: true,
                                id: String(user._id),
                              });
                            }}
                            className="flex items-center cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 cursor-pointer overflow-hidden">
                              {user?.imageUrl ? (
                                <img
                                  src={user.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-gray-300" />
                              )}
                            </div>

                            {user?.fname + " " + user?.lname || "user name"}
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            setIsViewModalOpen({
                              open: true,
                              id: String(user._id),
                            });
                          }}
                          className="py-3 px-4 text-white cursor-pointer"
                        >
                          {user?.email || "email"}
                        </td>
                        <td
                          onClick={() => {
                            setIsViewModalOpen({
                              open: true,
                              id: String(user._id),
                            });
                          }}
                          className="py-3 px-4 text-white cursor-pointer"
                        >
                          {user?.phone || "phone"}
                        </td>
                        <td
                          onClick={() => {
                            setIsViewModalOpen({
                              open: true,
                              id: String(user._id),
                            });
                          }}
                          className="py-3 px-4 text-white cursor-pointer"
                        >
                          {user?.dateOfBirth
                            ? new Date(user.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : "DOB"}
                        </td>
                        <td
                          onClick={() => {
                            setIsViewModalOpen({
                              open: true,
                              id: String(user._id),
                            });
                          }}
                          className="py-3 px-4"
                        >
                          <span className="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">
                            {user?.isBlocked ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditModal({
                                  open: true,
                                  id: String(user?._id),
                                });
                              }}
                              className="p-1 hover:bg-gray-700 rounded-full"
                            >
                              <Edit size={18} className="text-blue-400" />
                            </button>
                            <button
                              onClick={() =>
                                openDeleteDialog(
                                  String(user._id),
                                  `${user.fname} ${user.lname}`
                                )
                              }
                              className="p-1 hover:bg-gray-700 rounded-full"
                            >
                              <Trash2 size={18} className="text-red-400" />
                            </button>

                            <button
                              onClick={() => {
                                handleuserBlocking(
                                  !user.isBlocked,
                                  String(user._id),
                                  String(user.email)
                                );
                              }}
                              className="p-1 hover:bg-gray-700 rounded-full"
                            >
                              {user.isBlocked ? (
                                <UnlockKeyhole
                                  size={18}
                                  className="text-green-400"
                                />
                              ) : (
                                <Ban size={18} className="text-orange-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-700"></div>
          </div>
        </div>
      </div>
    </>
  );
}
