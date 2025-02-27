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
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../Redux/Hook";
import { toast } from "react-toastify";
import { userData } from "../types/interfaces";
import { validateProfile } from "../utils/validation/validate";
import { createUser } from "@/Redux/Admin/admin.thunk";

type CreateUserType = {
  data: Partial<userData>;
  error: Partial<Record<keyof userData, string>>;
};

export default function CreateUserModal({
  setCreateModal,
}: {
  setCreateModal: any;
}) {
  const dispatch = useAppDispatch();
  const [newUser, setNewUser] = useState<CreateUserType>({
    data: { role: "user", isBlocked: false },
    error: {},
  });

  const [showPassword, setShowPassword] = useState(false);

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
    password: (
      <Lock size={18} className="absolute left-3 top-2.5 text-gray-400" />
    ),
  };

  const placeholders: Record<string, string> = {
    fname: "Enter first name",
    lname: "Enter last name",
    email: "Enter email address",
    phone: "Enter phone number",
    dateOfBirth: "Select date of birth",
    companyName: "Enter company name",
    designation: "Enter designation",
    address: "Enter address",
    password: "Enter password",
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | undefined>
  ) {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: type === "checkbox" ? checked : value },
      error: {},
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateProfile(newUser.data);
    if (Object.keys(errors).length) {
      setNewUser((prev) => ({ ...prev, error: errors }));
      return;
    }
    const result = await dispatch(createUser(newUser.data));
    if (createUser.fulfilled.match(result)) {
      toast.success("User created successfully");
      setCreateModal(false);
    } else {
      toast.error(String(result.payload) || "Failed to create user");
    }
  }

  const formFields = [
    "fname",
    "lname",
    "email",
    "password",
    "phone",
    "dateOfBirth",
    "companyName",
    "designation",
    "address",
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="mt-14 bg-gray-800/95 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-700/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create User
          </h2>
          <button
            onClick={() => setCreateModal(false)}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors duration-200"
          >
            <X
              size={20}
              className="text-gray-400 hover:text-white transition-colors"
            />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {formFields.map((field) => (
            <div key={field} className="space-y-2 group">
              <label className="text-sm font-medium text-gray-300 capitalize group-focus-within:text-blue-400 transition-colors">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <div className="relative">
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "dateOfBirth"
                      ? "date"
                      : field === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  name={field}
                  placeholder={placeholders[field]}
                  value={
                    field === "dateOfBirth"
                      ? newUser.data.dateOfBirth
                        ? new Date(newUser.data.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                      : newUser.data[field] || ""
                  }
                  onChange={handleChange}
                  className="w-full p-2.5 pl-10 rounded-lg border border-gray-600 bg-gray-800/50 
                           text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                           transition-all duration-200 placeholder-gray-500"
                />
                {fieldIcons[field]}
                {field === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
                {newUser.error[field as keyof userData] && (
                  <p className="text-red-400 text-xs mt-1 ml-1">
                    {newUser.error[field as keyof userData]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-300 group-focus-within:text-blue-400 transition-colors">
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={newUser.data.role || "user"}
                onChange={handleChange}
                className="w-full p-2.5 pl-10 rounded-lg border border-gray-600 bg-gray-800/50 
                         text-white appearance-none focus:border-blue-500 focus:ring-1 
                         focus:ring-blue-500 transition-all duration-200"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <Shield
                size={18}
                className="absolute left-3 top-2.5 text-gray-400 
                                        group-focus-within:text-blue-400 transition-colors"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700/50">
          <button
            onClick={() => setCreateModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 
                     rounded-lg hover:bg-gray-600/50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 
                     rounded-lg hover:bg-blue-500 flex items-center gap-2 
                     transition-colors duration-200"
          >
            <Save size={18} /> Create User
          </button>
        </div>
      </div>
    </div>
  );
}
