import React, {useState} from "react";
import { Menu } from "lucide-react";
import "./style.css";
import SideBar from "../../../../components/SideBar/SideBar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <h1 className="navbar-title">신고</h1>
      </div>
    </nav>
  );
}
