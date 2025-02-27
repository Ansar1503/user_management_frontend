import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { fetchUserDetails } from "@/Redux/Admin/admin.thunk";
import { useAppDispatch, useAppSelector } from "@/Redux/Hook";
import { toast } from "react-toastify";

interface ViewUserModalProps {
  isOpen: {id:string,open:boolean};
  onClose: () => void;
}

const ViewUserModal = ({ isOpen, onClose }: ViewUserModalProps) => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(state=>state.admin.userDetails)
  useEffect(() => {
    getUserDetails(isOpen.id);
  }, [isOpen]);
  async function getUserDetails(id: string) {
    const result = await dispatch(fetchUserDetails(id));
    if (fetchUserDetails.fulfilled.match(result)) {
      
    } else {
      toast.error(String(result.payload) || "Failed to fetch user details");
    }
  }
  return (
    <Dialog open={isOpen.open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-lvh bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 p-6">
          <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
            {userDetails.imageUrl ? (
              <img
                src={userDetails.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              {userDetails.fname} {userDetails.lname}
            </h2>
            <p className="text-gray-400">
              {userDetails.designation || "No designation provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { label: "Email", value: userDetails.email },
              { label: "Phone", value: userDetails.phone },
              { label: "Role", value: userDetails.role },
              { label: "Status", value: userDetails.isBlocked ? "Blocked" : "Active" },
              {
                label: "Address",
                value: userDetails.address || "Not provided",
              },
              {
                label: "Company",
                value: userDetails.companyName || "Not provided",
              },
              {
                label: "Date of Birth",
                value: userDetails.dateOfBirth
                  ? new Date(userDetails.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not provided",
              },
            ].map((field, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-1">
                <p className="text-gray-400 text-sm">{field.label}</p>
                <p className="font-medium">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
