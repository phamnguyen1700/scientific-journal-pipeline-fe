export type UserRole =
  | "Student"
  | "Lecturer"
  | "Researcher"
  | "System Administrator"
  | "Admin";

export function isAdminRole(role: UserRole | null | undefined) {
  return role === "Admin" || role === "System Administrator";
}

export function getDefaultRouteByRole(role: UserRole | null | undefined) {
  return isAdminRole(role) ? "/admin" : "/dashboard";
}
