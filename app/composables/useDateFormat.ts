export const useDateFormat = () => {
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const currentLocale = useNuxtApp().$i18n?.locale.value || "en";

    // 12/29/2025, 7:42 PM
    return new Intl.DateTimeFormat(currentLocale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return {
    formatDate,
  };
};
