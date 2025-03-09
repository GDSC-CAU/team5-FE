import React from "react";
import { MessageCircle, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-item">
        <MessageCircle onClick={() => navigate("/managerChat")} />
        <span>채팅</span>
      </div>
      <div className="nav-item">
        <User onClick={() => navigate("/staff")} />
        <span>직원</span>
      </div>
      <div className="nav-item">
        <AlertCircle onClick={() => navigate("/reportList")} />
        <span>신고</span>
      </div>
    </div>
  );
}