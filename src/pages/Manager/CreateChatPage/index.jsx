import React from "react";
import Navbar from "./NavBar"; // 네비게이션
import ChatTitle from "./ChatTitle"; // 채팅 목록
import BottomNav from "./BottomNav"; // 하단 네비게이션
import "./style.css"; // 스타일 적용

export default function ChatPage() {
  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-content">
        <ChatTitle />
      </div>
      <BottomNav />
    </div>
  );
}
