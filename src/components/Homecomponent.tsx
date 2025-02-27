import { FaCamera, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/Hook";
import Navbar from "./Navbar";
import { validateProfile } from "../utils/validation/validate";
import { userData, FormDataState } from "../types/interfaces";
import { Riple } from "react-loading-indicators";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../Redux/Auth/Auth.thunk";

const Homecomponent = () => {
  const user: userData | null = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.isLoading);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataState>({
    fname: user?.fname || "",
    lname: user?.lname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    address: user?.address || "",
    companyName: user?.companyName || "",
    dateOfBirth: user?.dateOfBirth || "",
    designation: user?.designation || "",
    imageUrl: user?.imageUrl || "",
    isBlocked: user?.isBlocked || false,
    errors: {},
  });

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!editMode) {
      setFormData((state) => ({
        ...state,
        errors: {},
      }));
    }
  }, [editMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const errors = validateProfile(updated);
      return { ...updated, errors };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxFileSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          imageUrl: "Please select a file.",
        },
      }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setFormData((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          imageUrl: "File type must be .jpg or .png.",
        },
      }));
      return;
    }

    if (file.size > maxFileSize) {
      setFormData((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          imageUrl: "File size must be less than 5 MB.",
        },
      }));
      return;
    }

    const fileURL = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl: fileURL,
      file,
      errors: { ...prev.errors, imageUrl: "" },
    }));
  };

  const saveChanges = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("fname", formData.fname);
    formDataToSend.append("lname", formData.lname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("address", formData.role || "");
    formDataToSend.append("companyName", formData.companyName || "");
    formDataToSend.append("dateOfBirth", formData.dateOfBirth || "");
    formDataToSend.append("designation", formData.designation || "");

    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    const result = await dispatch(updateProfile(formDataToSend));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setEditMode(false);
      // navigate("/home");
    } else {
      if (result.error)
        toast.error(
          String(result.payload) || "failed to update profile"
        );
      // toast.error(result.payload || "Failed to update profile");
    }
  };
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      fname: user?.fname || "",
      lname: user?.lname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "",
      address: user?.address || "",
      companyName: user?.companyName || "",
      dateOfBirth: user?.dateOfBirth || "",
      designation: user?.designation || "",
      imageUrl: user?.imageUrl || "",
      isBlocked: user?.isBlocked || false,
      errors: {},
    });
  };
  return (
    <>
      <Navbar />
      {user && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <Riple color="#202a33" size="medium" />
            </div>
          )}

          <div className="w-full max-w-3xl relative">
            <div
              className={`bg-gray-800 rounded-lg shadow-lg p-6 ${
                loading ? "opacity-65 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex flex-col items-center relative">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-200 overflow-hidden relative">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl || user.imageUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                  {editMode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center justify-center bg-gray-700 text-white p-2 rounded-full cursor-pointer"
                      >
                        <FaCamera size={16} />
                      </label>
                    </div>
                  )}
                </div>
                {formData.errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {formData.errors.imageUrl}
                  </p>
                )}

                {user.role == "admin" && !editMode ? (
                  <button
                    className="relative top-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-slate-600"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </button>
                ) : (
                  ""
                )}

                <div className="text-center mt-4">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="fname"
                        placeholder="Enter first name"
                        value={formData.fname}
                        onChange={handleInputChange}
                        className="text-xl w-full sm:w-56 font-semibold text-white border-b-2 bg-inherit border-gray-600  focus:outline-none focus:border-blue-500 mb-2"
                      />
                      {formData.errors.fname && (
                        <p className="text-red-500 text-sm mt-1">
                          {formData.errors.fname}
                        </p>
                      )}
                      <input
                        type="text"
                        name="lname"
                        value={formData.lname}
                        onChange={handleInputChange}
                        className="text-xl w-full sm:w-56 font-semibold text-white border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                      />
                      {formData.errors.lname && (
                        <p className="text-red-500 text-sm mt-1">
                          {formData.errors.lname}
                        </p>
                      )}
                    </>
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">
                      {formData.fname} {formData.lname}
                    </h2>
                  )}
                  <p className="text-gray-400">
                    {editMode ? (
                      <input
                        type="text"
                        name="designation"
                        placeholder="Enter your designation..."
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="border-b-2 placeholder:text-slate-600 placeholder:text-sm border-gray-600 bg-transparent text-white focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
                      />
                    ) : (
                      formData.designation || "Designation not provided"
                    )}
                  </p>
                  <p className="text-red-500 text-sm mt-1">
                    {formData?.errors?.designation}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Email", name: "email" },
                  { label: "Phone", name: "phone" },
                  { label: "Address", name: "address" },
                  { label: "Company", name: "companyName" },
                  { label: "Date of Birth", name: "dateOfBirth" },
                  { label: "role", name: "role", editable: false },
                ].map((field) => (
                  <div key={field.name}>
                    <h3 className="text-gray-400">
                      {field.label}
                    </h3>

                    {editMode && field.editable !== false ? (
                      <>
                        <input
                          type={field.name === "dateOfBirth" ? "date" : "text"}
                          name={field.name}
                          value={
                            field.name === "dateOfBirth" && formData.dateOfBirth
                              ? new Date(formData.dateOfBirth)
                                  .toISOString()
                                  .split("T")[0]
                              : String(
                                  formData[field.name as keyof userData] || ""
                                )
                          }
                          onChange={handleInputChange}
                          className="w-full border-b-2 text-white border-gray-600 bg-transparent focus:outline-none focus:border-blue-500"
                        />

                        {formData.errors[field.name] && (
                          <p className="text-red-500 text-sm mt-1">
                            {formData.errors[field.name]}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="font-medium text-white">
                        {field.name === "dateOfBirth" && formData.dateOfBirth
                          ? new Date(formData.dateOfBirth).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : formData[field.name as keyof userData] ||
                            "Not provided"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                {editMode ? (
                  <>
                    <button
                      className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                      onClick={saveChanges}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Homecomponent;
