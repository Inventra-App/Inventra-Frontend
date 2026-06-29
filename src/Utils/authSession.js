const SESSION_EXPIRED_MESSAGE_KEY = "inventra_session_expired_message";

const AUTH_STORAGE_KEYS = [
  "inventra_token",
  "inventra_access_token",
  "accessToken",
  "token",
  "refreshToken",
  "inventra_refresh_token",
  "inventra_is_new_user",
  "inventra_show_inventory_guide",
  "inventra_user",
];

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore storage failures */
    }
  });
};

export const setSessionExpiredMessage = (
  message = "Your session has expired. Please log in again to continue.",
) => {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_MESSAGE_KEY, message);
  } catch {
    /* ignore storage failures */
  }
};

export const consumeSessionExpiredMessage = () => {
  try {
    const message = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);
    sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
    return message;
  } catch {
    return "";
  }
};
