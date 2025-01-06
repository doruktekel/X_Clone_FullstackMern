import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: updateMutation,
    isError,
    error,
    isPending: isUpdatePending,
  } = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`/api/v1/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "An error occurred");
      return data;
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred");
    },
  });

  return { updateMutation, isError, error, isUpdatePending };
};

export default useUpdateProfile;
