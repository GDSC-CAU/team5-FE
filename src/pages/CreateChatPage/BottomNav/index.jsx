import React from "react";
import { MessageCircle, User, AlertCircle } from "lucide-react";
import "./style.css";

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="nav-item">
        <MessageCircle />
        <span>채팅</span>
      </div>
      <div className="nav-item">
        <User />
        <span>직원</span>
      </div>
      <div className="nav-item">
        <AlertCircle />
        <span>신고</span>
      </div>
    </div>
  );
}