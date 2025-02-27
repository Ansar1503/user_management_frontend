import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Shield,
  X,
  Save,
  Building,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/Hook";
import { toast } from "react-toastify";
import { editUserDetails, fetchUserDetails } from "../Redux/Admin/admin.thunk";
import { userData } from "../types/interfaces";
import { validateProfile } from "../utils/validation/validate";

type EditUserType = {
  data: Partial<userData>;
  error: Partial<Record<keyof userData, string>>;
};

export default function EditUserModal({
  setEditModal,
  editModal,
}: {
  setEditModal: any;
  editModal: { open: boolean; id: string };
}) {
  const users = useAppSelector(state=>state.admin.users)
  const dispatch = useAppDispatch();
  const [editUser, setEditUser] = useState<EditUserType>({
    data: {},
    error: {},
  });
  useEffect(() => {
    getUserDetails(editModal.id);
  }, [users]);

  async function getUserDetails(id: string) {
    const result = await dispatch(fetchUserDetails(id));
    if (fetchUserDetails.fulfilled.match(result)) {
      setEditUser({ data: result.payload, error: {} });
    } else {
      toast.error(String(result.payload) || "Failed to fetch user details");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      error: {},
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateProfile(editUser.data);
    if (Object.keys(errors).length) {
      setEditUser((prev) => ({ ...prev, error: errors }));
      return;
    }
    setEditUser((prev) => ({
      ...prev,
      data: { ...prev.data, id: editModal.id },
    }));
    const result = await dispatch(editUserDetails(editUser.data));
    if (editUserDetails.fulfilled.match(result)) {
      console.log(result.payload);
      toast.success(result.payload);
      setEditUser({ data: result.payload, error: {} });
      setEditModal({ open: false,id:null });
    } else {
      toast.error(String(result.payload) || "Failed to fetch user details");
    }
  }

  const fieldIcons: Record<string, JSX.Element> = {
    fname: <User size={18} className="absolute left-3 top-2.5 text-gray-400" />,
    lname: <User size={18} className="absolute left-3 top-2.5 text-gray-400" />,
    email: <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />,
    phone: (
      <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
    ),
    dateOfBirth: (
      <CalendarIcon
        size={18}
        className="absolute left-3 top-2.5 text-gray-400"
      />
    ),
    companyName: (
      <Building size={18} className="absolute left-3 top-2.5 text-gray-400" />
    ),
    designation: (
      <Briefcase size={18} className="absolute left-3 top-2.5 text-gray-400" />
    ),
    address: (
      <MapPin size={18} className="absolute left-3 top-2.5 text-gray-400" />
    ),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className=" mt-14 bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b  border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Edit User
          </h2>
          <button
            onClick={() => setEditModal(false)}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "fname",
            "lname",
            "email",
            "phone",
            "dateOfBirth",
            "companyName",
            "designation",
            "address",
          ].map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <div className="relative">
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "dateOfBirth"
                      ? "date"
                      : "text"
                  }
                  name={field}
                  value={
                    field === "dateOfBirth"
                      ? editUser.data.dateOfBirth
                        ? new Date(editUser.data.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                      : editUser.data[field] || ""
                  }
                  onChange={handleChange}
                  className="w-full p-2 pl-10 rounded-md border border-gray-600 bg-gray-800 text-white"
                />
                {fieldIcons[field]}
                {editUser.error[field as keyof userData] && (
                  <p className="text-red-500 text-xs">
                    {editUser.error[field as keyof userData]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={editUser.data.role || "user"}
                onChange={handleChange}
                className="w-full p-2 pl-10 rounded-md border border-gray-600 bg-gray-800 text-white appearance-none"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <Shield
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700">
          <button
            onClick={() => setEditModal(false)}
            className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2`}
          >
            <Save size={18} /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
