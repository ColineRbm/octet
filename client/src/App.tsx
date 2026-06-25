import { Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/benevole" replace />;
};

export default App;
