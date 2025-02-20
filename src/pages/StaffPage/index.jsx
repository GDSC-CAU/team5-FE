import React from "react";
import BottomNav from "./BottomNav"; 
import NavBar from "./NavBar";
import "./style.css"; 

const members = [
  { id: 1, name: "토니", english: "TONY", img: "/profile1.png" },
  { id: 2, name: "패트릭", english: "PATRICK", img: "/profile2.png" },
  { id: 3, name: "스티븐", english: "STEVEN", img: "/profile3.png" },
  { id: 4, name: "티모시", english: "TIMOTHY", img: "/profile4.png" },
];

export default function StaffPage() {
  return (
    <div className="chat-page">
      <NavBar />

      {/* 직원 리스트 */}
      <div className="member-list">
        {members.map((member) => (
          <div key={member.id} className="member-item">
            <img src={member.img} alt={member.name} className="member-img" />
            <span className="member-name">
              {member.name} ({member.english})
            </span>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
