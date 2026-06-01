import { Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/benevole" replace />;
};

export default App;
