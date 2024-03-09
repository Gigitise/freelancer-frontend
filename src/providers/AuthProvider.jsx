import { useContext } from "react";
import { createContext } from "react";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "../../utils/Auth/AuthService";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const profileUrl = `${import.meta.env.VITE_API_URL}/profile`;

  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(getAccessToken());
  const [loadedUserProfile, setuserProfile] = useState();
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);
  const [loginError, setLoginError] = useState({});
  const [loadingReg, setLoadingReg] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [successRegister, setSuccessRegister] = useState(false);
  const [successLogin, setSuccessLogin] = useState(false);

  const headers = {
    "content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getUserProfile = async () => {
    setLoadingUserProfile(true);
    try {
      const getProfile = await fetch(`${profileUrl}`, {
        method: "get",
        headers,
      });

      const profile = await getProfile.json();
      setuserProfile(profile[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUserProfile(false);
    }
  };

  const handleLogOut = () => {
    removeAccessToken();
    setUserToken(null);
    navigate("/app");
  };

  const handleRegister = async (e) => {
    setLoadingReg(true);
    e.preventDefault();
    const registerUrl = `${import.meta.env.VITE_API_URL}/auth/client/register/`;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password1 = e.target.password1.value;
    const password2 = e.target.password2.value;

    try {
      const registerClient = await fetch(registerUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password_1: password1,
          password_2: password2,
        }),
      });

      if (registerClient.ok) {
        console.log("Registration success");
        setSuccessRegister(true);
        navigate("/app");
      } else {
        const res = await registerClient.json();
        const status = registerClient.status;
        if (status === 400) {
          const errors = Object.values(res);
          setRegisterError(errors);
          console.log(errors);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingReg(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const orderId = new URLSearchParams(location.search).get("order");
    const redirect = new URLSearchParams(location.search).get("redirect");
    setLoading(true);
    setLoginError({});
    const username = e.target.username.value;
    const password = e.target.password.value;
    const loginUrl = `${import.meta.env.VITE_API_URL}/token/f/`;
    console.log("Profile URL:", profileUrl);
    console.log("Login URL:", loginUrl);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const getToken = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        signal: controller.signal,
      });
      console.log("Request:", getToken);

      const status = getToken.status;
      clearTimeout(timeoutId);

      if (status === 200) {
        const token = await getToken.json();
        setSuccessLogin(true);

        const accessToken = token.access;
        setAccessToken(accessToken);
        getUserToken();
        setLoading(false);
        if (orderId) {
          navigate(`/app/order/${orderId}`);
        } else if (redirect) {
          navigate(`/app/${redirect}`);
        } else {
          navigate("/app");
        }
        // const refreshToken = token.refresh
      } else if (status === 401) {
        setLoginError({
          error: "Invalid credentials!",
        });
      } else {
        setLoginError({
          error: "Error during login! Try again",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error.name);
      if (error.name === "AbortError") {
        setLoginError({
          error: "Request too long!",
        });
      } else {
        setLoginError({
          error: "Error during login! Try again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePhoto = async (photo, id) => {
    const data = new FormData();
    data.append("profile_photo", photo);

    try {
      const response = await fetch(`${profileUrl}/${id}/`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      const res = response.json();
      return res;
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const submitNewBio = async (newBio, id) => {
    try {
      const response = await fetch(`${profileUrl}/${id}/`, {
        method: "put",
        headers: headers,
        body: JSON.stringify({
          bio: newBio,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getUserToken = () => {
    console.log("Getting token");
    const token = getAccessToken();

    if (token) {
      setUserToken(token);
    } else {
      setUserToken(null);
    }
  };

  useEffect(() => {
    if (!userToken) {
      getAccessToken();
    }

    userToken && getUserProfile();
  }, [userToken]);

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleLogOut,
        submitNewBio,
        uploadProfilePhoto,
        handleRegister,
        registerError,
        loadingReg,
        userToken,
        loadedUserProfile,
        loadingUserProfile,
        loading,
        loginError,
        successRegister,
        successLogin,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}
