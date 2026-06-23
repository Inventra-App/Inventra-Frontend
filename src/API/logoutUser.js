import API from "./axios";
import { store } from "../redux/store";
import { clearAuth } from "../redux/apiSlice";
import { clearUsersData } from "../redux/usersSlice";
import { clearAuthStorage } from "../Utils/authSession";

// Calls the backend logout endpoint and fully tears down the local session.
//
// 1. POST /logout with the bearer token (attached automatically by axios).
// 2. Clear every known token from localStorage.
// 3. Reset redux auth + user-scoped state.
// 4. Show a toast for user feedback.
// 5. Return the API response (or the error) so the caller can navigate.
//
// If the network call fails we still complete the local cleanup — better
// UX than trapping the user on a dashboard with a broken session.
export const logoutUser = async () => {
  try {
    const res = await API.post("logout");
    return res.data;
  } catch (error) {
    // Re-throw so the caller can decide what to do, but the finally-style
    // cleanup below is what guarantees a clean state regardless.
    console.error("Logout request failed:", error);
    throw error;
  } finally {
    clearAuthStorage();
    localStorage.removeItem("inventra_user");

    try {
      store.dispatch(clearAuth());
      store.dispatch(clearUsersData());
    } catch (err) {
      console.error("Failed to reset redux on logout:", err);
    }
  }
};

export default logoutUser;
