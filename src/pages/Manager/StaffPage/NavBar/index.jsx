import React, {useState} from "react";
import {Menu, Plus, Minus, ChevronDown} from "lucide-react";
import SideBar from "../../../../components/SideBar/SideBar"; // Sidebar 추가
import "./style.css";

export default function Navbar({
  onAddClick,
  onToggleDeleteMode,
  isDeleteMode,
  selectedCategory,
  setSelectedCategory,
  onDeleteAllTemporaryWorkers
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가
  const categories = ["직원", "일용직", "정규직"];

  return (
      <nav className="navbarStaff">
        <div className="navbar-left">
          <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="dropdown">
          <span className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {selectedCategory} <ChevronDown size={16}/>
          </span>
            {isDropdownOpen && (
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                      <li
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category); // 선택한 카테고리를 StaffPage로 전달
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
          <Plus className="plus-icon" onClick={onAddClick}/>
          <Minus
              className={`minus-icon ${isDeleteMode ? "active" : ""}`}
              onClick={() => {
                if (selectedCategory === "일용직") {
                  onDeleteAllTemporaryWorkers(); // 일용직 전체 삭제 실행
                } else {
                  onToggleDeleteMode(); // 기본 삭제 모드 실행
                }
              }}
          />

        </div>
      </nav>
  );
}

