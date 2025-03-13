import React, {useState} from "react";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import SideBar from "../../../../components/SideBar/SideBar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <h1 className="navbar-title">채팅</h1>
      </div>
    </nav>
  );
}
