import { useQuery } from "@tanstack/react-query";

const useGetAllNotification = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/v1/notification");

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });
  return { notifications, isLoading };
};

export default useGetAllNotification;
