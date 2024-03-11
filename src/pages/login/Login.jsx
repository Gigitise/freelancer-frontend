import React from "react";
import "./login.css";
import { useAuthContext } from "../../providers/AuthProvider";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import LoadingDots from "../../icons/loading-dots";
import { toast } from "react-hot-toast";
import gigitise from "../../../public/gigitise.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const iconSize = 30;
  const { loginError, handleLogin, loading } = useAuthContext();
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const usernameRef = useRef();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const togglePassword = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (loginError.error) {
      setPassword("");
      toast.error(`Login failed: ${loginError.error}`);
    }
  }, [loginError]);

  return (
    <div className="login-container">
      <div className="btn">
        <div className="brand-logo">
          <img src={gigitise} style={{ width: "6rem" }} alt="logo" />
        </div>
        <div className="brand-title">Gigitise</div>
        <form onSubmit={handleLogin} className="inputs">
          <div className="login-content">
            <FiUser className="username-icon" size={iconSize} />
            <input
              required
              id="username"
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="login-content ">
            <MdLock className="password-icon" size={iconSize} />
            <input
              required
              id="password"
              className="bg-gray-700"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={visible ? "text" : "password"}
              placeholder="Password"
            />
            {visible ? (
              <IoEye
                onClick={togglePassword}
                className="password-icon-eye"
                size={20}
              />
            ) : (
              <IoEyeOff
                onClick={togglePassword}
                className="password-icon-eye"
                size={20}
              />
            )}
          </div>
          <button className="Sign" type="submit">
            {loading ? <LoadingDots color="#1387E6" size={15} /> : "Sign In"}
          </button>
        </form>
        <div className="register-prompt">
          <article className="reset-password">
            <Link to="/reset-password">Forgot password</Link>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Login;
