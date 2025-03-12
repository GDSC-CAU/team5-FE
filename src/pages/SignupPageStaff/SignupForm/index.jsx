import { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_HOST from "../../../constants/ApiHost";
import defaultAvatarImg from "../../../assets/image/default-avatar.png";

const SignupForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('KOREAN'); // 기본값 KOREAN
  const [profileImage, setProfileImage] = useState(defaultAvatarImg); // 기본 프로필 이미지
  const [error, setError] = useState('');

  // 프로필 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // 이미지 미리보기
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_HOST}/auth/user/signup`, {
        loginId: userId,
        password,
        name,
        language
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.isSuccess) {
        alert("회원가입 성공!");
        navigate("/");
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      if (err.response?.data?.code === "AUTH4003") {
        setError("이미 존재하는 아이디입니다.");
      } else {
        setError("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <form className="signup__form" onSubmit={handleSubmit}>
      {/* 프로필 이미지 업로드 */}
      <label className="profile-upload">
        <img src={profileImage} alt="Profile Preview" className="profile-preview" />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {/* 아이디 입력 */}
      <input
        className="BoldS"
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />

      {/* 비밀번호 입력 */}
      <input
        className="BoldS"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* 이름 입력 */}
      <input
        className="BoldS"
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* 언어 선택 */}
      <select className="BoldS" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="KOREAN">한국어</option>
        <option value="ENGLISH">영어</option>
        <option value="VIETNAMESE">베트남어</option>
        <option value="JAPANESE">일본어</option>
        <option value="CHINESE">중국어</option>
      </select>

      {/* 오류 메시지 */}
      {error && <p className="error">{error}</p>}

      {/* 가입 버튼 */}
      <button className="BodyS" type="submit">가입하기</button>
    </form>
  );
};

export default SignupForm;
