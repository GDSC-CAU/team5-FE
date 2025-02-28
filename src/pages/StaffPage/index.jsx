import React, { useState } from "react";
import BottomNav from "./BottomNav"; 
import NavBar from "./NavBar";
import "./style.css"; 

export default function StaffPage() {
  const [members, setMembers] = useState([
    { id: 1, name: "토니", english: "TONY", img: "/profile1.png" },
    { id: 2, name: "패트릭", english: "PATRICK", img: "/profile2.png" },
    { id: 3, name: "스티븐", english: "STEVEN", img: "/profile3.png" },
    { id: 4, name: "티모시", english: "TIMOTHY", img: "/profile4.png" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [isTemporary, setIsTemporary] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("직원");

  // 모달 토글
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // 직원 추가
  const handleAddMember = () => {
    if (!newMemberId.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }

    const newMember = {
      id: members.length + 1,
      name: newMemberId,
      english: newMemberId.toUpperCase(),
      img: "/default_profile.png",
      isTemporary,
    };

    setMembers([...members, newMember]);
    setNewMemberId(""); 
    setIsTemporary(false);
    setIsModalOpen(false);
  };

  // 직원 삭제 모드 토글
  const toggleDeleteMode = () => setIsDeleteMode(!isDeleteMode);

  // 직원 삭제
  const deleteMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="chat-page">
      {/* 네비게이션 바 */}
      <NavBar 
        onAddClick={toggleModal} 
        onToggleDeleteMode={toggleDeleteMode} 
        isDeleteMode={isDeleteMode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 직원 리스트 */}
      <div className={`member-list ${isDeleteMode ? "delete-mode" : ""}`}>
        {members.map((member) => (
          <div key={member.id} className="member-item">
            {isDeleteMode && (
              <button className="delete-button" onClick={() => deleteMember(member.id)}>✕</button>
            )}
            <img src={member.img} alt={member.name} className="member-img" />
            <span className="member-name">
              {member.name} ({member.english})
            </span>
          </div>
        ))}
      </div>

      {/* 직원 추가 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={toggleModal}>✖</button>
            <div className="profile-placeholder">👤</div>
            <h3>아이디로 추가하기</h3>

            <input
              type="text"
              placeholder="아이디"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="modal-input"
            />

            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isTemporary}
                onChange={() => setIsTemporary(!isTemporary)}
              />
              일용직인가요?
            </label>

            <button className="add-btn" onClick={handleAddMember}>추가</button>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
