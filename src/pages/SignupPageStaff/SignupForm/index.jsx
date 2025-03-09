import { useState } from 'react';
import './style.css';
import { register } from '../../../features/user';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState(''); // 사용 언어
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // 이미지 미리보기
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(userId, password, name, language, profileImage);

    if (result) {
      alert('회원가입 성공');
      navigate('/staffChat');
    } else {
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <form className="signup__form" onSubmit={handleSubmit}>
      {/* 프로필 이미지 업로드 */}
      <label className="profile-upload">
        {profileImage ? (
          <img src={profileImage} alt="Profile Preview" className="profile-preview" />
        ) : (
          <div className="profile-placeholder">📷</div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {/* 아이디 입력 */}
      <input
        className="BoldS"
        type="text"
        name="username"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />

      {/* 비밀번호 입력 */}
      <input
        className="BoldS"
        type="password"
        name="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* 이름 입력 */}
      <input
        className="BoldS"
        type="text"
        name="name"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* 사용 언어 선택 */}
      <select
        className="BoldS"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        required
      >
        <option value="">사용 언어 선택</option>
        <option value="Korean">한국어</option>
        <option value="English">English</option>
        <option value="Vietnamese">Tiếng Việt</option>
        <option value="Japanese">日本語</option>
        <option value="Chinese">中文</option>
      </select>

      {/* 가입 버튼 */}
      <button className="BodyS" type="submit">가입하기</button>
    </form>
  );
};

export default SignupForm;
