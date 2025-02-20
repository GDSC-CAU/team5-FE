import React from "react";
import Chat from "./Chat"; // 채팅 목록
import "./style.css"; // 스타일 적용

export default function ChatPage() {
  return (
    <div className="chat-page">
      <div className="chat-content">
        <Chat />
      </div>
    </div>
  );
}