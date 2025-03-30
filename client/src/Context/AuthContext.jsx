import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import * as jwt_decode from 'jwt-decode'; 
import jwt_decode from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Decode user from token instead of API call
  const loadUserFromToken = () => {
    try {
      if (token) {
        const decoded = jwt_decode(token);
        setUser({
          _id: decoded._id,
          name: decoded.name,
          email: decoded.email,
          profilePic: decoded.profilePic
        });
      }
    } catch (err) {
      console.error("Token decoding failed:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, profilePic) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }
  
      const response = await axios.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Register Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Register Error:", error.response?.data || error);
      throw error.response?.data || { error: "Registration failed" };
    }
  };
  

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
  
      setToken(res.data.token);
      setAuthToken(res.data.token);
  
      console.log("Login response:", res.data);
  
      setUser(res.data.user); 
  
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 100);
      
    } catch (err) {
      console.error("Login error:", err);
      throw err.response?.data || { error: "Login failed" };
    }
  };
  

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        loadUserFromToken(); 
      }
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;