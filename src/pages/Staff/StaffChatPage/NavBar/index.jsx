import React from "react";
import { Menu, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Menu className="menu-icon" />
        <h1 className="navbar-title">채팅</h1>
      </div>
    </nav>
  );
}
