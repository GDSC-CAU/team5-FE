import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/"); // 로그아웃 후 로그인 페이지로 이동
  }, [logout, navigate]);

  return <p>로그아웃 중...</p>; // 잠깐 표시될 메시지
};

export default Logout;