import { createContext, useEffect, useState } from "react";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isTokenExpired } from "./auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReaderContext = createContext();

export default ReaderContext;

export const ContextProvider = ({ children }) => {
  let navigate = useNavigate();

  let [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  let [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    if (tokens) {
      const parsedTokens = JSON.parse(tokens);
      if (!isTokenExpired(parsedTokens.access)) {
        return parsedTokens;
      }
    }
    return null;
  });

  let [reader, setReader] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  let [readerName, setReaderName] = useState(reader?.username);

  const registerReader = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (e.target.password.value.length < 8) {
      toast.error("Password should contain atleast 8 characters");
      setLoading(false);
      return;
    }

    if (e.target.password.value !== e.target.confirmpassword.value) {
      toast.error("Passwords do not match, try again");
      setLoading(false);
      return;
    }

    try {
      let response = await fetch(`${backendUrl}api/reader/create-reader/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      if (response.status === 201) {
        let response2 = await fetch(`${backendUrl}api/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
          }),
        });

        let data2 = await response2.json();
        if (response2.status === 200) {
          setAuthTokens(data2);
          setReader(jwtDecode(data2.access));
          setReaderName(jwtDecode(data2.access).username);
          toast.success("You are now registered!");
          localStorage.setItem("authTokens", JSON.stringify(data2));
          navigate("/todays-articles");
        } else {
          toast.error(data2.details);
        }
      } else {
        const data = await response.json();
        toast.error(data.details);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch(`${backendUrl}api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setReader(jwtDecode(data.access));
        setReaderName(jwtDecode(data.access).username);
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/todays-articles");
        toast.success("You are now logged in!");
      } else {
        toast.error(data.detail);
        console.log(data);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setReader(null);
    setReaderName(null);
    localStorage.removeItem("authTokens");
    toast.success("You are now logged out");
    navigate("/login");
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logout();
      return false;
    }

    try {
      let response = await fetch(`${backendUrl}api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'refresh': authTokens.refresh,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setReader(jwtDecode(data.access));
        setReaderName(jwtDecode(data.access).user);
        localStorage.setItem("authTokens", JSON.stringify(data));
        return true;
      }
    } catch (error) {
      toast.error("Failed to refresh token. Please log in again.");
      logout();
    }

    return false;
  };

  useEffect(() => {
    console.log("useEffect triggered");

    const initializeAuth = async () => {
      if (authTokens) {
        const tokenValid = !isTokenExpired(authTokens.access);
        if (!tokenValid) {
          const refreshed = await updateToken();
          if (!refreshed) {
            logout();
          }
        }
      }
    };

    initializeAuth();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    console.log(backendUrl)
    const intervalTime = 1000 * 60 * 50;

    const interval = setInterval(() => {
      console.log("Interval running");
      if (authTokens) {
        console.log("Updating token...");
        updateToken();
      }
    }, intervalTime);
 
    return () => clearInterval(interval)
  }, [authTokens]);

  let contextData = {
    reader: reader,
    readerName: readerName,
    authTokens: authTokens,
    loading: loading,
    isSmallScreen: isSmallScreen,
    backendUrl: backendUrl,
    registerReader: registerReader,
    login: login,
    logout: logout,
  };

  return (
    <ReaderContext.Provider value={contextData}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ReaderContext.Provider>
  );
};
