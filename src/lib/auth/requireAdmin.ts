import type { User } from "@/types/api";
import { isAdmin } from "./roles";

export function requireAdmin(user?: User | null): boolean {
  return isAdmin(user);
}
