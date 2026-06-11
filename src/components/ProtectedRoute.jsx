import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../feature/auth/authSlice';
import { API_BASE_URL, axiosInstace } from './APIConfig';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user = useSelector(selectUser);


  useEffect(() => {
    if(!user) {
      setIsAuthenticated(false);
      return;
    }

    axiosInstace.get(`${API_BASE_URL}/check-auth`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.access_token}`
      }
    })
    .then(() => setIsAuthenticated(true))
    .catch(() => setIsAuthenticated(false));

  }, [user]);
  
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute