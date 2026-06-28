const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();
  if (value === "admin") return "Admin";
  if (value === "manager") return "Manager";
  if (value === "cashier") return "Cashier";
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
};

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
};

export const decodeJwtPayload = (token) => {
  try {
    const payload = String(token || "").split(".")[1];
    if (!payload) return {};
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return {};
  }
};

export const getRoleFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  return normalizeRole(
    payload.role ||
      payload.userRole ||
      payload.staffRole ||
      payload.user?.role ||
      payload.staff?.role ||
      payload.data?.role ||
      payload.data?.user?.role ||
      payload.data?.staff?.role,
  );
};

export const getStaffLoginDestination = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "Cashier") return "/sales";
  return "/dashboard";
};

export const getLoginPathForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "Cashier") return "/cashier-login";
  if (normalizedRole === "Manager") return "/staff-login";
  return "/login";
};

export const isJwtExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
};

const rolePermissions = {
  Admin: [
    "/dashboard",
    "/inventory",
    "/inventory/categories",
    "/sales",
    "/expiry",
    "/activity",
    "/users",
    "/settings",
  ],
  Manager: ["/dashboard", "/inventory", "/inventory/categories", "/expiry", "/activity", "/settings"],
  Cashier: [ "/sales",],
};

export const canAccessPath = (role, path) => {
  const normalizedRole = normalizeRole(role) || "Admin";
  const permissions = rolePermissions[normalizedRole] || rolePermissions.Cashier;
  const cleanPath = path || "/dashboard";

  return permissions.some(
    (permission) => cleanPath === permission || cleanPath.startsWith(`${permission}/`),
  );
};

export const filterNavItemsByRole = (items, role) =>
  items.filter((item) => canAccessPath(role, item.path));

export { normalizeRole };
