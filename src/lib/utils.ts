import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function is_payment_overdue(due_date: Date): boolean {
  return new Date() > new Date(due_date.getTime() + 28 * 24 * 60 * 60 * 1000);
}