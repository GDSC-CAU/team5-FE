import React, { useState } from "react";
import ChatItem from "../ChatItem";
import { useNavigate } from "react-router-dom";
import "./style.css";

const initialChatRooms = [
  { id: 1, teamId: 101, img: "/profile1.png", title: "Q-Company 2025", message: "주의사항 모두 정독 부탁드립니다.", time: "오후 10:00" },
  { id: 2, teamId: 102, img: "/profile2.png", title: "Q-Company Group A", message: "주의사항 모두 정독 부탁드립니다.", time: "오후 10:00" },
];

export default function ChatList() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState(initialChatRooms);
  const [selectedChat, setSelectedChat] = useState(null);

  //채팅을 길게 누르거나 우클릭하면 삭제 버튼 표시
  const handleLongPress = (id) => {
    setSelectedChat(id);
  };

  //삭제 버튼 클릭 시 확인 후 삭제 (이동 X)
  const handleDeleteChat = (id, event) => {
    event.stopPropagation(); 
    const confirmDelete = window.confirm("이 채팅을 삭제하시겠습니까?");
    if (confirmDelete) {
      setChatRooms(chatRooms.filter(chat => chat.id !== id));
      setSelectedChat(null);
    }
  };

  return (
    <div className="chat-list">
      {chatRooms.map((chat) => (
        <div
          key={chat.id}
          className="chat-item-container"
          onClick={() => {
            if (selectedChat !== chat.id) {
              navigate(`/chat/${chat.teamId}`);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleLongPress(chat.id);
          }}
        >
          <ChatItem img={chat.img} title={chat.title} message={chat.message} time={chat.time} />

          {/*선택된 채팅에만 삭제 버튼*/}
          {selectedChat === chat.id && (
            <button className="delete-chat-btn" onClick={(e) => handleDeleteChat(chat.id, e)}>
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
