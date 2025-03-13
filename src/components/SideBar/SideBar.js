import React, {useState, useEffect, useRef} from "react";
import {Menu, X} from "lucide-react";
import "./SideBar.css";
import {CSSTransition} from "react-transition-group";
import {useAuth} from "../../contexts/AuthContext";
import defaultImage from "../../assets/image/default-admin-avatar.png";
import UserRole from "../../constants/UserRole";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const {user, role, logout} = useAuth();

  let roleDescription;

  if (role === UserRole.ADMIN) {
    roleDescription = "관리자";
  }else if (role === UserRole.MEMBER) {
    roleDescription = "근로자";
  } else{
    roleDescription = "알 수 없음";
  }
  return (
      <>
        {/* 햄버거 버튼 */}
        <Menu className="menu-icon" onClick={() => setIsOpen(true)}/>

        {/* 오버레이 및 사이드바 */}
        <CSSTransition
            in={isOpen} // 상태에 따라 애니메이션 실행
            timeout={300} // 애니메이션 지속 시간
            classNames="mobile-sidebar-overlay" // CSS 클래스 이름
            unmountOnExit // 애니메이션 종료 후 컴포넌트 제거
        >
          <div
              className="mobile-sidebar-overlay"
              onClick={() => setIsOpen(false)}
          >
          </div>
        </CSSTransition>
        <CSSTransition
            in={isOpen} // 상태에 따라 애니메이션 실행
            timeout={300} // 애니메이션 지속 시간
            classNames="sidebar" // CSS 클래스 이름
            unmountOnExit // 애니메이션 종료 후 컴포넌트 제거
        >
          <div
              className="mobile-sidebar"
              onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={24}/>
            </button>
            <div className="profile-section">
              <img
                  src={defaultImage}
                  alt="프로필"
                  className="profile-image"
              />
              <p className="role">{roleDescription}</p>
              <p className="username">{user.name}</p>
            </div>
            <button className="logout-button"
                    onClick={() => logout()}>
              로그아웃
            </button>
          </div>
        </CSSTransition>
      </>
  );
}