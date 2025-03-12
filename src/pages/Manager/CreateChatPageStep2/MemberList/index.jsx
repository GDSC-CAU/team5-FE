import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import API_HOST from "../../../../constants/ApiHost";

export default function MemberList({ onSelect }) {
  const [members, setMembers] = useState([]); // 직원 리스트 상태
  const [selectedMembers, setSelectedMembers] = useState([]);
  const adminId = localStorage.getItem("userId"); // 관리자 ID 가져오기

  // ✅ 직원 리스트 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_HOST}/admin/${adminId}/employees`);
        if (response.data.isSuccess) {
          setMembers(response.data.result.employees);
        } else {
          alert("직원 목록을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("직원 목록 불러오기 실패:", error);
      }
    };

    if (adminId) fetchMembers();
  }, [adminId]);

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
          key={member.userId}
          className={`member-select-item ${selectedMembers.includes(member.userId) ? "selected" : ""}`}
          onClick={() => toggleSelect(member.userId)}
        >
          <img src="/default_profile.png" alt={member.name} className="member-select-img" />
          <span className="member-select-name">{member.name}</span>
        </div>
      ))}
    </div>
  );
}
