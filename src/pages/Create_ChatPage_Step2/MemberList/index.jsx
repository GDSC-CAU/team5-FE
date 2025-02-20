import React, { useState } from "react";
import "./style.css"; // 스타일 적용

// 더미 구성원 데이터
const members = [
  { id: 1, name: "토니", english: "TONY", img: "/profile1.png" },
  { id: 2, name: "패트릭", english: "PATRICK", img: "/profile2.png" },
  { id: 3, name: "스티븐", english: "STEVEN", img: "/profile3.png" },
  { id: 4, name: "티모시", english: "TIMOTHY", img: "/profile4.png" },
  { id: 5, name: "토니", english: "TONY", img: "/profile1.png" },
  { id: 6, name: "패트릭", english: "PATRICK", img: "/profile2.png" },
];

export default function MemberList() {
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 멤버 상태 저장

  // 멤버 클릭 시 선택/해제
  const toggleSelect = (id) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id) // 이미 선택됨 → 제거
        : [...prevSelected, id] // 선택되지 않음 → 추가
    );
  };

  return (
    <div className="member-list">
      {members.map((member) => (
        <div
          key={member.id}
          className={`member-item ${selectedMembers.includes(member.id) ? "selected" : ""}`}
          onClick={() => toggleSelect(member.id)}
        >
          <img src={member.img} alt={member.name} className="member-img" />
          <span className="member-name">
            {member.name} ({member.english})
          </span>
        </div>
      ))}
    </div>
  );
}
