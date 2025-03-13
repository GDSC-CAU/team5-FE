import React, {useState, useEffect, useRef} from "react";
import {Menu, X} from "lucide-react";
import "./SideBar.css";
import {CSSTransition} from "react-transition-group"; // 스타일 파일 분리

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
                  src="https://via.placeholder.com/100"
                  alt="프로필"
                  className="profile-image"
              />
              <p className="role">관리자</p>
              <p className="username">홍길동</p>
            </div>
            <button className="logout-button"
                    onClick={() => setIsOpen(false)}>
              로그아웃
            </button>
          </div>
        </CSSTransition>
      </>
  );
}