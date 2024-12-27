import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();
  const {
    mutate: followUnFollowMutation,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["followUnFollow"],
    mutationFn: async (id) => {
      const res = await fetch(`/api/v1/user/follow/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong!");
      return data;
    },
    onSuccess: () => {
      toast.success("Followed successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { followUnFollowMutation, isPending };
};

export default useFollow;
