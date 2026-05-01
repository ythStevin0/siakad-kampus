import { type ReactNode } from "react";

export interface MenuItem {
  label: string;
  to?: string;
  icon?: ReactNode;
  type?: "header" | "item";
  isDropdown?: boolean;
  badge?: string;
  subItems?: { label: string; to: string; icon?: ReactNode }[];
}
