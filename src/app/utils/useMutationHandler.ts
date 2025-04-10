import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useMutationHandler = ({
  mutationFn,
  onSuccessMessage,
  queryKey,
  onSuccess = () => {}, // Default fungsi kosong jika tidak diberikan
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      toast.success(onSuccessMessage);
      queryClient.invalidateQueries(queryKey);
      onSuccess(...args); // ✅ Panggil onSuccess jika diberikan
    },
    onError: () => {
      toast.error("Terjadi kesalahan, silakan coba lagi.");
    },
  });
};
