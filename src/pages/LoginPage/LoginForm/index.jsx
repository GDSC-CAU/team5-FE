import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import {useAuth} from "../../../contexts/AuthContext";
import API_HOST from "../../../constants/ApiHost";
import UserRole from "../../../constants/UserRole";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_HOST}/auth/login`,
        { loginId: id, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.isSuccess) {
        const { id: userId, name, role, token } = response.data.result;

        //JWT 토큰 & 유저 정보 저장
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);

        //role에 따라 페이지 이동
        if (role === UserRole.ADMIN) {
          login({userId: userId, token: token, name: name}, role);
          navigate("/managerChat");
        } else if (role === UserRole.MEMBER) {
          login({userId: userId, token: token, name: name}, role);
          navigate("/staffChat");
        } else {
          setError("알 수 없는 사용자 역할입니다.");
        }
      } else {
        setError(response.data.message || "로그인 실패");
      }
    } catch (error) {
      let message = "로그인 중 오류가 발생했습니다.";
      if (error.response.data.code) {
        message = "잘못된 아이디 혹은 비밀번호 입니다.";
      }
      setError(message);
    }
  };

  return (
    <form className="login__form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        className="BoldS"
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="BoldS"
        type="password"
        placeholder="PW"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button BodyS" type="submit">로그인</button>
      <button className="login-button BodyS" type="button" onClick={() => navigate("/managesignup")}>
        관리자 회원가입
      </button>
      <button className="login-button BodyS" type="button" onClick={() => navigate("/staffsignup")}>
        근로자 회원가입
      </button>
    </form>
  );
};

export default LoginForm;
