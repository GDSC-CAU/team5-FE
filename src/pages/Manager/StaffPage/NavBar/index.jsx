import React, { useState } from "react";
import { Menu, Plus, Minus, ChevronDown } from "lucide-react";
import "./style.css";

export default function Navbar({ onAddClick, onToggleDeleteMode, isDeleteMode }) {
  const [selectedCategory, setSelectedCategory] = useState("직원");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["직원", "일용직", "정규직"];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Menu className="menu-icon" />
        <div className="dropdown">
          <span
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory} <ChevronDown size={16} />
          </span>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <Plus className="plus-icon" onClick={onAddClick} />
        <Minus className={`minus-icon ${isDeleteMode ? "active" : ""}`} onClick={onToggleDeleteMode} />
      </div>
    </nav>
  );
}
