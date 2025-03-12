import {Navigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import UserRole from "../constants/UserRole";

const ProtectedRoute = ({allowedRoles, children}) => {
  const {isAuthenticated, role} = useAuth();
  if (!allowedRoles.includes(role)) {
    console.log("thisisit");
    console.log(role, allowedRoles);
    let url = "/";
    if (role === UserRole.MEMBER) {
      url = "/staffChat";
    } else if (role === UserRole.ADMIN) {
      url = "/managerChat";
    } else {
      url = "/";
    }
    return <Navigate to={url} replace/>;
  }
  return children;
};

export default ProtectedRoute;