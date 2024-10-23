import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => !!state.user.userId);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  return user.isAdmin ? children : <Navigate to="/login" />;
};
