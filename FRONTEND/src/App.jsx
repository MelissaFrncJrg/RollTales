import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AdminRoute, PrivateRoute } from "./utils/privateRoute";
import { clearUser, fetchUser } from "./redux/userSlice";

import CreateElement from "./common/element/createElement";
import ListElements from "./common/element/listElements";
import AdminDashboard from "./components/adminDashboard/dashboard";
import AuthService from "./services/authService";
import CampaignForm from "./components/campaign/campaignForm";
import CreateCharacter from "./components/characters/createCharacter";
import EditProfile from "./components/user-profile/editProfile";
import Header from "./components/menu/header";
import Invite from "./components/invite/invite";
import LoginSignup from "./components/login-signup/loginSignup";
import MyCampaigns from "./components/campaign/myCampaigns";
import ResetPassword from "./components/resetPassword/resetPassword";
import UserProfile from "./components/user-profile/userProfile";

import "../src/assets/styles/App.scss";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAdmin = user.isAdmin;
  const isAuthenticated = !!user.userId;

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = () => {
    AuthService.logout();
    dispatch(clearUser());
  };

  return (
    <Router>
      {isAuthenticated && <Header handleLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/profile" /> : <LoginSignup />
          }
        />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ? (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/add-element"
          element={
            <AdminRoute>
              <CreateElement />
            </AdminRoute>
          }
        />

        <Route path="/elements" element={<ListElements />} />

        <Route path="/acceptInvite" element={<Invite />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile handleLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile handleLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <PrivateRoute>
              <CampaignForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-elements"
          element={
            <PrivateRoute>
              <ListElements isAdmin={isAdmin} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-campaign/:campaignId"
          element={
            <PrivateRoute>
              <CampaignForm isEdit={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-character"
          element={
            <PrivateRoute>
              <CreateCharacter />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-campaigns"
          element={
            <PrivateRoute>
              <MyCampaigns />
            </PrivateRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
