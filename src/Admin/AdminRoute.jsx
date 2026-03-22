// src/Admin/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user or role_id is not admin (1), redirect
  if (!user || user.role_id !== 1) {
    return <Navigate to="/" />;
  }

  // Otherwise allow access
  return children;
};

export default AdminRoute;