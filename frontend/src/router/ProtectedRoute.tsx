import React, { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../providers/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      setToken(null);
    }
  }, [token, setToken]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
