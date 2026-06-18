const SESSION_USER_KEY = "inventra_user";
const NEW_USER_KEY = "inventra_is_new_user";

const pick = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

export const buildSessionUser = (source = {}, fallback = {}) => {
  const user = source.user ?? source.admin ?? source.staff ?? source.data?.user ?? source.data?.admin ?? source.data ?? source;
  const firstName = pick(user.firstName, user.firstname, source.firstName, fallback.firstName, "");
  const lastName = pick(user.lastName, user.lastname, source.lastName, fallback.lastName, "");
  const fullName = pick(user.fullName, user.name, `${firstName} ${lastName}`.trim(), fallback.fullName, "Admin User");
  const business = user.business ?? user.businessDetails ?? user.supermarket ?? source.business ?? source.businessDetails ?? {};
  const businessName = pick(
    user.businessName,
    user.storeName,
    business.businessName,
    business.name,
    source.businessName,
    fallback.businessName,
    "Inventra"
  );

  return {
    firstName,
    lastName,
    fullName,
    businessName,
    role: pick(user.role, source.role, fallback.role, "Admin"),
    email: pick(user.email, source.email, fallback.email, ""),
  };
};

export const saveSessionUser = (source, fallback, options = {}) => {
  const sessionUser = buildSessionUser(source, fallback);
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionUser));
  if (options.isNewUser) localStorage.setItem(NEW_USER_KEY, "true");
  return sessionUser;
};

export const getSessionUser = () => (
  readJson(SESSION_USER_KEY) ?? buildSessionUser()
);

export const isNewSessionUser = () => localStorage.getItem(NEW_USER_KEY) === "true";

export const markReturningSessionUser = () => {
  localStorage.setItem(NEW_USER_KEY, "false");
};
