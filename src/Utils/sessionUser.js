const SESSION_USER_KEY = "inventra_user";
const NEW_USER_KEY = "inventra_is_new_user";
const INVENTORY_GUIDE_KEY = "inventra_show_inventory_guide";

const pick = (...values) =>
  values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== "",
  );
const toSlug = (value) =>
  String(value || "account")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "account";

const readJson = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

export const buildSessionUser = (source = {}, fallback = {}) => {
  const user =
    source.user ??
    source.admin ??
    source.staff ??
    source.data?.user ??
<<<<<<< HEAD
    source.data?.admin ??
    source.data?.staff ??
    source.data ??
    source;
  const firstName = pick(user.firstName, user.firstname, source.firstName, fallback.firstName, "");
  const lastName = pick(user.lastName, user.lastname, source.lastName, fallback.lastName, "");
  const fullName = pick(user.fullName, user.name, `${firstName} ${lastName}`.trim(), fallback.fullName, "");
  const business = user.business ?? user.businessDetails ?? user.supermarket ?? source.business ?? source.businessDetails ?? {};
=======
    source.data?.staff ??
    source.data?.admin ??
    source.data ??
    source;
  const firstName = pick(
    user.firstName,
    user.firstname,
    source.firstName,
    fallback.firstName,
    "",
  );
  const lastName = pick(
    user.lastName,
    user.lastname,
    source.lastName,
    fallback.lastName,
    "",
  );
  const fullName = pick(
    user.fullName,
    user.name,
    `${firstName} ${lastName}`.trim(),
    fallback.fullName,
    "",
  );
  const business =
    user.business ??
    user.businessDetails ??
    user.supermarket ??
    source.business ??
    source.businessDetails ??
    {};
>>>>>>> f6d84fd0edba759b83e0ace27f77ac85d55addba
  const email = pick(user.email, source.email, fallback.email, "");
  const businessName = pick(
    user.businessName,
    user.storeName,
    business.businessName,
    business.name,
    source.businessName,
    fallback.businessName,
    "",
  );
  const phone = pick(
    user.phone,
    user.phoneNumber,
    user.mobile,
    source.phone,
    source.phoneNumber,
    fallback.phone,
    "",
  );
  const businessAddress = pick(
    user.businessAddress,
    user.address,
    business.businessAddress,
    business.address,
    source.businessAddress,
    fallback.businessAddress,
    "",
  );
  const accountId = pick(
    user.accountId,
    user.businessId,
    user.supermarketId,
    business._id,
    business.id,
    source.accountId,
    source.businessId,
    fallback.accountId,
    fallback.businessId,
    businessName,
    email,
  );

  return {
    accountId: toSlug(accountId),
    id: pick(user._id, user.id, source._id, source.id, fallback.id, ""),
    firstName,
    lastName,
    fullName,
    businessName,
    phone,
    businessAddress,
    role: pick(user.role, source.role, fallback.role, ""),
    email,
  };
};

export const saveSessionUser = (source, fallback, options = {}) => {
  const previousUser = readJson(SESSION_USER_KEY);
  const hadPendingGuide =
    sessionStorage.getItem(INVENTORY_GUIDE_KEY) === "true";
  const sessionUser = buildSessionUser(source, fallback);
  const isNewUser = options.isNewUser === true;
  const previousEmail = String(previousUser?.email || "").toLowerCase();
  const currentEmail = String(sessionUser.email || "").toLowerCase();
  const isSamePendingAccount =
    hadPendingGuide &&
    !("isNewUser" in options) &&
    previousUser &&
    (previousUser.accountId === sessionUser.accountId ||
      (previousEmail && previousEmail === currentEmail));

  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionUser));
  sessionStorage.setItem(
    NEW_USER_KEY,
    isNewUser || isSamePendingAccount ? "true" : "false",
  );
  sessionStorage.setItem(
    INVENTORY_GUIDE_KEY,
    isNewUser || isSamePendingAccount ? "true" : "false",
  );
  return sessionUser;
};

export const getSessionUser = () =>
  readJson(SESSION_USER_KEY) ?? buildSessionUser();

export const isNewSessionUser = () =>
  sessionStorage.getItem(NEW_USER_KEY) === "true";

export const markReturningSessionUser = () => {
  sessionStorage.setItem(NEW_USER_KEY, "false");
};

export const shouldShowInventoryGuide = () =>
  sessionStorage.getItem(INVENTORY_GUIDE_KEY) === "true";

export const markInventoryGuideSeen = () => {
  sessionStorage.setItem(INVENTORY_GUIDE_KEY, "false");
};

export const getAccountPath = (
  path = "/dashboard",
  user = getSessionUser(),
) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${user.accountId}${cleanPath}`;
};
