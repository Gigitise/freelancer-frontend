import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import { useAuthContext } from "./providers/AuthProvider";
import { createContext, useState } from "react";
import PasswordReset from "./pages/reset-password/PasswordReset";
import SetPassword from "./components/modal/set-password/SetPassword";
import BadToken from "./pages/bad-token/BadToken";
import ExpiredToken from "./pages/expired-token/ExpiredToken";
import Navbar from "./components/navbar/Navbar";
import SideNav from "./components/sidenav/SideNav";
import Completed from "./pages/orders/completed/Completed";
import InProgress from "./pages/orders/in-progress/InProgress";
import Profile from "./pages/profile/Profile";
import ClientProfile from "./pages/profile/ClientProfile";
import Notification from "./pages/notification/Notification";
import OrderView from "./pages/orders/order-view/OrderView";
import Settings from "./pages/settings/Settings";
import Available from "./pages/orders/available/Available";
import BidDetails from "./pages/orders/Bid-view/BidDetails";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const { userToken } = useAuthContext();

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const Main = () => {
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
  };

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/app/*" element={userToken ? <Main /> : <Login />} />
          <Route path="reset-password" element={<PasswordReset />} />
          <Route
            path="/used-token/:uidb64/:token/"
            element={<ExpiredToken />}
          />
          <Route path="/bad-token/:uidb64/:token/" element={<BadToken />} />
          <Route
            path="/set-new-password/:uidb64/:token/"
            element={<SetPassword />}
          />
        </Routes>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
