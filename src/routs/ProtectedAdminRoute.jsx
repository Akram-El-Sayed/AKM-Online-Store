import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }) => {
  const { isLoggedIn, role } = useSelector((state) => state.user);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
};
