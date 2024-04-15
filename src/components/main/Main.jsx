import React from "react";
import Navbar from "../navbar/Navbar";
import SideNav from "../sidenav/SideNav";
import Completed from "../../pages/orders/completed/Completed";
import InProgress from "../../pages/orders/in-progress/InProgress";
import Profile from "../../pages/profile/Profile";
import ClientProfile from "../../pages/profile/ClientProfile";
import Notification from "../../pages/notification/Notification";
import OrderView from "../../pages/orders/order-view/OrderView";
import Settings from "../../pages/settings/Settings";
import Available from "../../pages/orders/available/Available";
import BidDetails from "../../pages/orders/Bid-view/BidDetails";
import Dashboard from "../../pages/dashboard/Dashboard";
import { Route, Routes } from "react-router-dom";
import { ThemeContext } from "../../App";
import { useState } from "react";

export default function Main() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <main className="app" id={theme}>
          <SideNav />
          <div className="app-main-content">
            <Navbar />
            <div className="routes">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/in-progress" element={<InProgress />} />
                <Route path="/available" element={<Available />} />
                <Route path="/my-bids" element={<BidDetails />} />
                <Route path="/completed" element={<Completed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notification />} />
                <Route
                  path="/client-profile/:clientParam"
                  element={<ClientProfile />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/order/:orderId" element={<OrderView />} />
              </Routes>
            </div>
          </div>
        </main>
      </ThemeContext.Provider>
    </>
  );
}
