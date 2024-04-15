import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import { useAuthContext } from "./providers/AuthProvider";
import { createContext, useState } from "react";
import PasswordReset from "./pages/reset-password/PasswordReset";
import SetPassword from "./components/modal/set-password/SetPassword";
import BadToken from "./pages/bad-token/BadToken";
import ExpiredToken from "./pages/expired-token/ExpiredToken";
import Main from "./components/main/Main";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("dark");
  const { userToken } = useAuthContext();

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
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
