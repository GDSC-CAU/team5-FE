import React from "react";
import "./style.css";

export default function ChatItem({ img, title, message, time }) {
  return (
    <div className="chat-item">
      <div className="chat-item-left">
        <img src={img} alt="Profile" />
        <div className="chat-text">
          <span className="chat-title">{title}</span>
          <span className="chat-message">{message}</span>
        </div>
      </div>
      <span className="chat-time">{time}</span>
    </div>
  );
}