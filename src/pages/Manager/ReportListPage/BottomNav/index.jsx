import React from "react";
import { MessageCircle, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-item">
        <MessageCircle />
        <span>채팅</span>
      </div>
      <div className="nav-item">
        <User onClick={() => navigate("/Staff")} />
        <span>직원</span>
      </div>
      <div className="nav-item">
        <AlertCircle />
        <span>신고</span>
      </div>
    </div>
  );
}