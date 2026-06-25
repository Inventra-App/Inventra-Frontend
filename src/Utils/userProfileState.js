import { setUser } from "../redux/apiSlice";
import { getSessionUser, saveSessionUser } from "./sessionUser";

const pick = (...values) =>
  values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== "",
  );

const unwrapProfile = (payload = {}) =>
  payload.user ??
  payload.profile ??
  payload.admin ??
  payload.data?.user ??
  payload.data?.profile ??
  payload.data?.admin ??
  payload.data ??
  payload;

export const normalizeUserProfile = (payload = {}, fallback = getSessionUser()) => {
  const profile = unwrapProfile(payload);
  const business =
    profile.business ??
    profile.businessDetails ??
    profile.supermarket ??
    payload.business ??
    payload.businessDetails ??
    {};

  const firstName = pick(profile.firstName, profile.firstname, fallback.firstName, "");
  const lastName = pick(profile.lastName, profile.lastname, fallback.lastName, "");
  const fullName = pick(
    profile.fullName,
    profile.name,
    `${firstName} ${lastName}`.trim(),
    fallback.fullName,
    "",
  );

  return {
    id: pick(profile._id, profile.id, payload._id, payload.id, fallback.id, ""),
    firstName,
    lastName,
    fullName,
    email: pick(profile.email, payload.email, fallback.email, ""),
    phone: pick(
      profile.phone,
      profile.phoneNumber,
      profile.mobile,
      payload.phone,
      payload.phoneNumber,
      fallback.phone,
      "",
    ),
    businessName: pick(
      profile.businessName,
      profile.storeName,
      business.businessName,
      business.name,
      payload.businessName,
      fallback.businessName,
      "",
    ),
    businessAddress: pick(
      profile.businessAddress,
      profile.address,
      business.businessAddress,
      business.address,
      payload.businessAddress,
      fallback.businessAddress,
      "",
    ),
    role: pick(profile.role, payload.role, fallback.role, ""),
    accountId: pick(
      profile.accountId,
      profile.businessId,
      profile.supermarketId,
      business._id,
      business.id,
      payload.accountId,
      fallback.accountId,
      fallback.businessName,
    ),
  };
};

export const persistUserProfile = (payload, dispatch) => {
  const currentUser = getSessionUser();
  const profile = normalizeUserProfile(payload, currentUser);
  const sessionUser = saveSessionUser(profile, currentUser);

  if (dispatch) {
    dispatch(setUser({ ...profile, ...sessionUser }));
  }

  return { profile, sessionUser };
};
