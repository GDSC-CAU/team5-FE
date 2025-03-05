import React from "react";
import ChatItem from "../ChatItem";
import "./style.css"; 

const chatRooms = [
  { img: "/profile1.png", title: "Q-Company 2025", message: "주의사항 모두 정독 부탁드립니다.", time: "오후 10:00" },
  { img: "/profile2.png", title: "Q-Company Group A", message: "주의사항 모두 정독 부탁드립니다.", time: "오후 10:00" },
];

export default function ChatList() {
  return (
    <div className="chat-list">
      {chatRooms.map((chat, index) => (
        <ChatItem key={index} img={chat.img} title={chat.title} message={chat.message} time={chat.time} />
      ))}
    </div>
  );
}