import React, {useState} from "react";
import NavBar from "./NavBar"; // 네비게이션
import ChatList from "./Chatlist"; // 채팅 목록
import BottomNav from "./BottomNav"; // 하단 네비게이션
import "./style.css";

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="app-page chat-page">
      <NavBar
          onAddClick={() => setIsModalOpen(true)}
      />
      <div className="chat-content">
        <ChatList />
      </div>
      <BottomNav />
    </div>
  );
}
