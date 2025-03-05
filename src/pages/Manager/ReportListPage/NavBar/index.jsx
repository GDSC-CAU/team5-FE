import React from "react";
import { Menu } from "lucide-react";
import "./style.css";

export default function Navbar() {

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Menu className="menu-icon" />
        <h1 className="navbar-title">신고</h1>
      </div>
    </nav>
  );
}
