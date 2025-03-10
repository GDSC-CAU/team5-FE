import React, { useState, useEffect } from "react";
import "./style.css";

// ✅ 더미 사용자 데이터
const members = [
  { id: 1, name: "토니", english: "TONY", img: "/profile1.png" },
  { id: 2, name: "패트릭", english: "PATRICK", img: "/profile2.png" },
  { id: 3, name: "스티븐", english: "STEVEN", img: "/profile3.png" },
  { id: 4, name: "티모시", english: "TIMOTHY", img: "/profile4.png" },
];

export default function MemberList({ onSelect }) {
  const [selectedMembers, setSelectedMembers] = useState([]);

  // ✅ 멤버 선택/해제 함수
  const toggleSelect = (id) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id) // ✅ 이미 선택됨 → 제거
        : [...prevSelected, id] // ✅ 선택되지 않음 → 추가
    );
  };

  // ✅ 선택한 멤버 목록을 부모 컴포넌트에 전달
  useEffect(() => {
    onSelect(selectedMembers);
  }, [selectedMembers, onSelect]);

  return (
    <div className="member-select-list">
      {members.map((member) => (
        <div
          key={member.id}
          className={`member-select-item ${selectedMembers.includes(member.id) ? "selected" : ""}`}
          onClick={() => toggleSelect(member.id)}
        >
          <img src={member.img} alt={member.name} className="member-select-img" />
          <span className="member-select-name">{member.name} ({member.english})</span>
        </div>
      ))}
    </div>
  );
}
