import { format, parseISO } from "date-fns";

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "dd/MM/yyyy");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "dd/MM/yyyy HH:mm");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};