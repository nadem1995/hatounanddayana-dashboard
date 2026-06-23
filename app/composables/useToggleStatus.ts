export const useToggleStatus = () => {
  const toast = useToast();
  const { t } = useI18n();

  const toggle = async (
    path: string,
    activeMessage: string,
    inActiveMessage: string
  ) => {
    try {
      const responce: any = await useApiFetchRaw(path, {
        method: "PATCH",
      });

      toast.add({
        title: responce.message,
        color: "success",
        icon: "i-lucide-circle-check",
      });
      return true;
    } catch (error: any) {
      toast.add({
        title: t("status.error_title"),
        description: error.data.message || "An error occurred",
        color: "error",
        icon: "i-lucide-circle-x",
      });
      return false;
    }
  };

  // 2. Return the toggle function to be used in components
  return { toggle };
};
