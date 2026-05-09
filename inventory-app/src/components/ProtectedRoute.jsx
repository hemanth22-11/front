import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, currentUser, requiredRole }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

export default ProtectedRoute;