import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-pulse text-muted-foreground">Carregando…</div>
  </div>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader />;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  return <>{children}</>;
};
