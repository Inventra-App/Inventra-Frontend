import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  Lock,
  Power,
  Settings,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";
import "./Css/UserMgm.css";
import Icon1 from "../../assets/Icon (10).png";
import Icon2 from "../../assets/Icon (11).png";
import Vector from "../../assets/Vector (2).png";
import Icon3 from "../../assets/Icon (0).png";
import Icon4 from "../../assets/Icon (6).png";
import Icon5 from "../../assets/Icon (7).png";
import manage from "../../assets/manage-roles-icon.png";
import green from "../../assets/Icon green.png";
import { getSessionUser } from "../../Utils/sessionUser";
import {
  getStaffs,
  loginStaff,
  onBoardStaff,
  suspendStaff,
  changeStaffRole,
  resetStaffPassword,
} from "../../API/userManagementAPI";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.staffs)) return payload.staffs;
  if (Array.isArray(payload?.staff)) return payload.staff;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};
const normalizeStaff = (staff) => {
  const fullName =
    staff?.fullName ??
    staff?.name ??
    `${staff?.firstName ?? ""} ${staff?.lastName ?? ""}`.trim();

  const rawRole = staff?.role ?? "Cashier";
  const role =
    String(rawRole).charAt(0).toUpperCase() +
    String(rawRole).slice(1).toLowerCase();

  const rawStatus = String(
    staff?.status ?? staff?.loginStatus ?? "",
  ).toLowerCase();

  const isSuspended = staff?.isSuspended === true || rawStatus === "suspended";

  const isActive = Boolean(
    !isSuspended &&
    (staff?.isLoggedIn ||
      staff?.loggedIn ||
      staff?.online ||
      staff?.isOnline ||
      staff?.active ||
      staff?.isActive ||
      rawStatus === "active" ||
      rawStatus === "online" ||
      rawStatus === "logged in"),
  );

  const normalizedStatus = isSuspended
    ? "Suspended"
    : isActive
      ? "Active"
      : "Inactive";

  const lastLoginValue =
    staff?.lastLogin ||
    staff?.lastLoginAt ||
    staff?.lastSeen ||
    staff?.loginAt ||
    staff?.updatedAt;

  return {
    id:
      staff?._id ??
      staff?.id ??
      staff?.staffId ??
      `${staff?.email}-${fullName}`,

    name: fullName || "User",
    username: staff?.email ?? staff?.username ?? staff?.gmail ?? "No email",
    role,
    status: normalizedStatus,

    joined: staff?.createdAt
      ? new Date(staff.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not available",

    lastLogin: lastLoginValue
      ? new Date(lastLoginValue).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not available",
  };
};

const UserMgm = () => {
  const reduxUser = useSelector((state) => state.apiInfo?.user);
  const currentUser = reduxUser ?? getSessionUser();
  const currentUsername =
    `${currentUser.firstName} ${currentUser.lastName}`.trim() ||
    currentUser.fullName;
  const currentAdminUser = useMemo(
    () => ({
      id: "current-admin",
      name: currentUser.businessName,
      username: currentUsername,
      role: "Admin",
      status: "Active",
      isCurrent: true,
      joined: "Current account",
      lastLogin: "Now",
    }),
    [currentUser.businessName, currentUsername],
  );
  const [users, setUsers] = useState([currentAdminUser]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  const [page, setPage] = useState("users");
  const [modal, setModal] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [newRole, setNewRole] = useState("");
  const [copied, setCopied] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const loadStaffs = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoadingUsers(true);
      }

      try {
        const response = await getStaffs();
        console.log(response);
        const staffs = getArrayPayload(response).map(normalizeStaff);
        setUsers([currentAdminUser, ...staffs]);
      } catch (error) {
        console.error("Staff fetch error:", error);
        setUsers([currentAdminUser]);
      } finally {
        if (!silent) {
          setLoadingUsers(false);
        }
      }
    },
    [currentAdminUser],
  );

  const permissions = [
    "Dashboard",
    "Inventory",
    "Sales (POS)",
    "Expiry Management",
    "Activity Logs",
    "Settings",
  ];

  const roles = ["manager", "cashier"];

  useEffect(() => {
    const timerId = window.setTimeout(loadStaffs, 0);
    return () => window.clearTimeout(timerId);
  }, [loadStaffs]);

  const defaultRolePermissions = {
    Manager: {
      Dashboard: true,
      Inventory: true,
      "Sales (POS)": false,
      "Expiry Management": true,
      "Activity Logs": true,
      Settings: true,
    },
    Cashier: {
      Dashboard: true,
      Inventory: false,
      "Sales (POS)": true,
      "Expiry Management": false,
      "Activity Logs": true,
      Settings: true,
    },
  };

  const roleDisplayName = {
    Manager: "Manager",
    Cashier: "Cashier",
  };

  const [activePermissionRole, setActivePermissionRole] = useState("Manager");

  const [rolePermissions, setRolePermissions] = useState(
    defaultRolePermissions,
  );

  const getActivePermissionMap = () => {
    return rolePermissions[activePermissionRole] || {};
  };

  const togglePermission = (permission) => {
    setRolePermissions((prev) => {
      const currentRoleMap = { ...(prev[activePermissionRole] || {}) };
      currentRoleMap[permission] = !currentRoleMap[permission];
      return { ...prev, [activePermissionRole]: currentRoleMap };
    });
  };

  const saveActivePermissions = () => {
    showToast(`${roleDisplayName[activePermissionRole]} permissions saved`);
  };

  const nameCharacterLimit = 15;
  const warnNameLimit = () => {
    showToast(
      `First and last name must not be more than ${nameCharacterLimit} characters`,
    );
  };

  const handleLimitedNameChange = (value, setter) => {
    if (value.length > nameCharacterLimit) {
      setter(value.slice(0, nameCharacterLimit));
      warnNameLimit();
      return;
    }

    setter(value);
  };

  const handleLimitedNameKeyDown = (event, value) => {
    const hasSelection =
      event.currentTarget.selectionStart !== event.currentTarget.selectionEnd;
    const isCharacterKey = event.key.length === 1;

    if (isCharacterKey && !hasSelection && value.length >= nameCharacterLimit) {
      event.preventDefault();
      warnNameLimit();
    }
  };

  const roleText = {
    Manager:
      "Can access dashboard, inventory, expiry management, activity log, and settings.",
    Cashier: "Can access dashboard, sales (POS), activity log, and settings.",
  };

  const totalUsers = users.length;
  const adminCount = users.filter((user) => user.role === "Admin").length;
  const managerCount = users.filter((user) => user.role === "Manager").length;
  const cashierCount = users.filter((user) => user.role === "Cashier").length;
  const staffCount = Math.max(totalUsers - adminCount, 0);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const getRoleClass = (userRole) => {
    return userRole.toLowerCase();
  };

  const isSuspended = (user) => Boolean(user) && user.status === "Suspended";
  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();
    if (normalizedStatus === "suspended") return "status-text suspended";
    if (normalizedStatus === "inactive") return "status-text inactive";
    return "status-text";
  };

  const closeModal = () => {
    setModal("");
    setNewRole("");
    setCopied(false);
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setModal("details");
  };

  const createUser = async (event) => {
    event.preventDefault();
    if (isCreatingStaff) return;

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();

    if (cleanFirstName === "" || cleanLastName === "") {
      showToast("First and last name is required");
      return;
    }

    if (cleanEmail === "") {
      showToast("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      showToast("Enter a valid email address");
      return;
    } else if (
      users.find(
        (user) => user.username.toLowerCase() === cleanEmail.toLowerCase(),
      )
    ) {
      showToast("Email already exists");
      return;
    }

    if (role === "") {
      showToast("Role is required");
      return;
    }

    const payload = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      role,
    };

    try {
      setIsCreatingStaff(true);
      const response = await onBoardStaff(payload);
      const createdStaff =
        response?.staff ?? response?.data ?? response?.user ?? payload;
      const newStaff = {
        ...normalizeStaff(createdStaff),
        status: "Inactive",
      };
      setUsers((currentUsers) => [...currentUsers, newStaff]);
      loadStaffs(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("");
      closeModal();
      showToast("New staff member has been created");
    } catch (error) {
      console.error("Create staff error:", error);
      showToast(
        error?.response?.data?.message ||
          "Failed to create staff. Please try again.",
      );
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const suspendUser = async () => {
    try {
      console.log("Suspending:", selectedUser);
      const response = await suspendStaff(selectedUser.id);
      console.log("Suspend response:", response);

      await loadStaffs(true);

      closeModal();

      showToast("User suspended successfully");
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to suspend user");
    }
  };

  const activateUser = () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, status: "Active" };
      }

      return user;
    });

    setUsers(updatedUsers);
    setSelectedUser({ ...selectedUser, status: "Active" });
    closeModal();
    showToast("User activated successfully");
  };

  const saveRoleChange = async (event) => {
    event.preventDefault();

    if (!newRole) return;

    try {
      await changeStaffRole(selectedUser.id, newRole.toLowerCase());

      await loadStaffs(true);

      closeModal();

      showToast("Role updated successfully");
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to update role");
    }
  };

  const copyPassword = () => {
    const passwordInput = document.getElementById("temporary-password");
    passwordInput.select();
    navigator.clipboard.writeText(passwordInput.value);
    setCopied(true);
  };

  const handleResetPassword = async () => {
    try {
      const response = await resetStaffPassword(selectedUser.username);

      setTemporaryPassword(response.data.password);
      setResetEmail(response.data.email);

      setCopied(false);
      setModal("password");

      showToast(response.message);
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to reset password");
    }
  };

  if (page === "roles") {
    return (
      <div className="user-page role-page">
        <div className="role-page-top">
          <div>
            <h2>Role & Permissions</h2>
            <p>Manage role-based access control</p>
          </div>
          <button
            className="back-users-btn"
            type="button"
            onClick={() => setPage("users")}
          >
            Back to Users
          </button>
        </div>

        <div className="role-select-grid">
          <button
            className={`role-select-card${activePermissionRole === "Manager" ? " active" : ""}`}
            type="button"
            onClick={() => setActivePermissionRole("Manager")}
          >
            <span className="role-select-icon manager">
              <Users size={22} />
            </span>
            <strong>Manager</strong>
            <small>Inventory management</small>
          </button>
          <button
            className={`role-select-card${activePermissionRole === "Cashier" ? " active" : ""}`}
            type="button"
            onClick={() => setActivePermissionRole("Cashier")}
          >
            <span className="role-select-icon cashier">
              <Users size={22} />
            </span>
            <strong>Cashier</strong>
            <small>Sales operations</small>
          </button>
        </div>

        <section className="manage-permissions-card">
          <h3>{roleDisplayName[activePermissionRole]} Permissions</h3>

          <div className="permission-toggle-list">
            {permissions.map((permission) => {
              const activeMap = getActivePermissionMap();
              const isChecked = Boolean(activeMap[permission]);
              return (
                <label
                  className="permission-toggle-row"
                  key={`${activePermissionRole}-${permission}`}
                >
                  <span>{permission}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => togglePermission(permission)}
                  />
                  <i aria-hidden="true"></i>
                </label>
              );
            })}
          </div>

          <div className="save-permissions-row">
            <button type="button" onClick={saveActivePermissions}>
              Save Permissions
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="user-page">
      {toast !== "" && <div className="user-toast">{toast}</div>}

      <div className="user-top">
        <div>
          <h2>User Management</h2>
          <p>Manage staff accounts and access levels</p>
        </div>

        <div className="user-top-actions">
          <button
            className="manage-roles-btn"
            type="button"
            onClick={() => setPage("roles")}
          >
            <img src={manage} alt="" className="manage-roles-icon" />
            <span>Manage roles</span>
          </button>

          <button
            className="onboard-btn"
            type="button"
            onClick={() => setModal("onboard")}
          >
            <img src={Icon1} alt="" />
            <span>Onboard Staff</span>
          </button>
        </div>
      </div>

      <section className="logged-card">
        <div className="logged-avatar">
          <img src={Icon4} alt="" />
        </div>

        <div>
          <p>Currently Logged In</p>
          <h3>{currentUser.businessName}</h3>
          <span>Role: Admin &bull; Username: {currentUsername}</span>
        </div>
      </section>

      <section className="user-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon purple">
            <img src={Icon2} alt="" />
          </div>
          <div>
            <p>Total Users</p>
            <h3>{totalUsers}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon violet">
            <img src={Vector} alt="" />
          </div>
          <div>
            <p>Admins</p>
            <h3>{adminCount}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <img src={Icon3} alt="" />
          </div>
          <div>
            <p>Managers</p>
            <h3>{managerCount}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <img src={Icon5} alt="" />
          </div>
          <div>
            <p>Cashiers</p>
            <h3>{cashierCount}</h3>
          </div>
        </div>
      </section>

      <section className="staff-card">
        <h3>Staff Directory</h3>

        <div className="staff-table">
          <div className="table-head">
            <span>User</span>
            <span>Username</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loadingUsers ? (
            <div className="table-row">
              <div className="staff-user">
                <div className="staff-avatar">...</div>
                <div>
                  <strong>Loading users...</strong>
                  <p>Please wait</p>
                </div>
              </div>
            </div>
          ) : (
            users.map((user) => (
              <div className="table-row" key={user.id}>
                <div className="staff-user">
                  <div className="staff-avatar">{user.name.charAt(0)}</div>
                  <div>
                    <strong>{user.name}</strong>
                    <p>ID: {user.id}</p>
                  </div>
                </div>

                <div className="table-field username-field">
                  <small className="mobile-field-label">Username</small>
                  <span className="username-text">{user.username}</span>
                </div>

                <div className="table-field role-field">
                  <small className="mobile-field-label">Role</small>
                  <span className={`role-pill ${getRoleClass(user.role)}`}>
                    {user.role}
                  </span>
                </div>

                <div className="table-field status-field">
                  <small className="mobile-field-label">Status</small>
                  <span className={getStatusClass(user.status)}>
                    <span></span>
                    {user.status}
                  </span>
                </div>

                {user.isCurrent ? (
                  <div className="table-field action-field">
                    <small className="mobile-field-label">Actions</small>
                    <span className="you-text">You</span>
                  </div>
                ) : (
                  <div className="table-field action-field">
                    <small className="mobile-field-label">Actions</small>
                    <button
                      className="details-btn"
                      type="button"
                      onClick={() => openDetails(user)}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="permission-card">
        <h3>Role Permissions</h3>

        <div className="permission-grid">
          <div className="permission-box manager">
            <div className="permission-title">
              <img src={Icon3} alt="" />
              <h4>Manager</h4>
            </div>
            <p>{roleText.Manager}</p>
          </div>

          <div className="permission-box cashier">
            <div className="permission-title">
              <img src={green} alt="" className="icon4" />
              <h4>Cashier</h4>
            </div>
            <p>{roleText.Cashier}</p>
          </div>
        </div>
      </section>

      {modal === "onboard" && (
        <div className="user-modal-backdrop compact">
          <form className="user-modal onboard-modal" onSubmit={createUser}>
            <button
              className="modal-close-btn"
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <h3>Create New User</h3>

            <label>
              <span>First Name</span>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                maxLength={nameCharacterLimit}
                onKeyDown={(event) =>
                  handleLimitedNameKeyDown(event, firstName)
                }
                onChange={(event) =>
                  handleLimitedNameChange(event.target.value, setFirstName)
                }
              />
            </label>

            <label>
              <span>Last Name</span>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                maxLength={nameCharacterLimit}
                onKeyDown={(event) => handleLimitedNameKeyDown(event, lastName)}
                onChange={(event) =>
                  handleLimitedNameChange(event.target.value, setLastName)
                }
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              <span>Role</span>
              <div className="modal-select-wrap">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value=""></option>
                  {roles.map((singleRole) => (
                    <option key={singleRole} value={singleRole}>
                      {singleRole}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </label>

            <div className="modal-actions">
              <button
                className="neutral-btn"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="primary-btn"
                type="submit"
                disabled={isCreatingStaff}
              >
                {isCreatingStaff ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal === "details" && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal details-modal">
            <button
              className="modal-close-btn"
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <h3>User Details</h3>

            <div className="details-user-banner">
              <div className="details-avatar">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <strong>{selectedUser.name}</strong>
                <span
                  className={`role-pill ${getRoleClass(selectedUser.role)}`}
                >
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div
              className={`detail-permission ${getRoleClass(selectedUser.role)}`}
            >
              <small>Role Permissions</small>
              <p>{roleText[selectedUser.role]}</p>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <User size={16} />
              </div>
              <div>
                <span>User ID</span>
                <strong>{selectedUser.id}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <UserCog size={16} />
              </div>
              <div>
                <span>Username</span>
                <strong>{selectedUser.username}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span>Account Status</span>
                <strong
                  className={
                    isSuspended(selectedUser)
                      ? "suspended-value"
                      : "active-value"
                  }
                >
                  {isSuspended(selectedUser)
                    ? "User is Suspended"
                    : selectedUser.status}
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={16} />
              </div>
              <div>
                <span>Date joined</span>
                <strong>{selectedUser.joined}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Settings size={16} />
              </div>
              <div>
                <span>Last Login</span>
                <strong>{selectedUser.lastLogin}</strong>
              </div>
            </div>

            <button
              className="full-primary-btn"
              type="button"
              onClick={handleResetPassword}
            >
              Change Password
            </button>

            <div className="details-actions">
              <button
                className="change-role-btn"
                type="button"
                onClick={() => setModal("role")}
              >
                <Lock size={14} />
                Change Role
              </button>

              {isSuspended(selectedUser) ? (
                <button
                  className="suspend-btn activate-action"
                  type="button"
                  onClick={() => setModal("activate")}
                >
                  <Power size={14} />
                  Activate User
                </button>
              ) : (
                <button
                  className="suspend-btn danger-action"
                  type="button"
                  onClick={() => setModal("suspend")}
                >
                  <AlertCircle size={14} />
                  Suspend User
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {modal === "suspend" && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="confirm-modal">
            <div className="confirm-icon">
              <AlertCircle size={22} />
            </div>
            <h3>Suspend User</h3>
            <p>
              Suspending <strong>{selectedUser.name.split(" ")[0]}</strong> will
              remove their access to the system until reactivated.
            </p>
            <div className="confirm-actions">
              <button
                className="neutral-btn"
                type="button"
                onClick={() => setModal("details")}
              >
                Cancel
              </button>
              <button
                className="danger-btn"
                type="button"
                onClick={suspendUser}
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "activate" && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="confirm-modal">
            <div className="confirm-icon activate-confirm-icon">
              <Power size={22} />
            </div>
            <h3>Activate User</h3>
            <p>
              Activating <strong>{selectedUser.name.split(" ")[0]}</strong> will
              restore their access to the system.
            </p>
            <div className="confirm-actions">
              <button
                className="neutral-btn"
                type="button"
                onClick={() => setModal("details")}
              >
                Cancel
              </button>
              <button
                className="activate-btn"
                type="button"
                onClick={activateUser}
              >
                Activate User
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "password" && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal reset-modal">
            <h3>Reset Password</h3>
            <div className="password-success-box">
              <CheckCircle2 size={22} />
              <div>
                <strong>Password Reset Successfully</strong>
                <p>
                  Password for <strong>{resetEmail}</strong> has been reset.
                </p>
                <p>Share this temporary password with the staff member.</p>
              </div>
            </div>
            <div className="temp-password-box">
              <label>Temporary Password</label>
              <div>
                <input
                  id="temporary-password"
                  readOnly
                  value={temporaryPassword}
                />
                <button type="button" onClick={copyPassword}>
                  <Copy size={18} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <button
              className="neutral-btn close-reset-btn"
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {modal === "role" && selectedUser && (
        <div className="user-modal-backdrop">
          <form
            className="user-modal change-role-modal"
            onSubmit={saveRoleChange}
          >
            <h3>Change Role</h3>
            <div className="role-change-info">
              <strong>User</strong>
              <p>{selectedUser.name}</p>
              <strong>Current Role</strong>
              <p>{selectedUser.role}</p>
            </div>
            <label>
              <span>New Role *</span>
              <div className="modal-select-wrap role-change-select">
                <select
                  required
                  value={newRole}
                  onChange={(event) => setNewRole(event.target.value)}
                >
                  <option value=""></option>
                  {roles.map((singleRole) => (
                    <option key={singleRole} value={singleRole}>
                      {singleRole}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <div className="modal-actions">
              <button
                className="neutral-btn"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button className="primary-btn" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserMgm;
