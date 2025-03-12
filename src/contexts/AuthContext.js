import { createContext, useReducer, useContext } from "react";
import UserRole from "../constants/UserRole";

// 초기 상태
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: localStorage.getItem("role") || UserRole.GUEST,
};

// Reducer 함수
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role, // "user" 또는 "admin"
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: UserRole.GUEST,
      };
    default:
      return state;
  }
};

// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 로그인 함수
  const login = (user, role) => {
    dispatch({ type: "LOGIN", payload: { user, role } });
  };

  // 로그아웃 함수
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
      <AuthContext.Provider value={{ ...state, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);