import React, { useEffect, useState } from "react";
import axios from "axios";
import BottomNav from "./BottomNav";
import NavBar from "./NavBar";
import "./style.css";
import API_HOST from "../../../constants/ApiHost";
import defaultProfileImage from '../../../assets/image/default-avatar.png';

export default function StaffPage() {
  const [members, setMembers] = useState([]); // 직원 리스트
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [isTemporary, setIsTemporary] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("직원");

  const adminId = localStorage.getItem("userId"); // 관리자 ID 저장

  const filteredMembers = members.filter((member) => {
    if (selectedCategory === "일용직") return member.isTemporaryWorker === true;
    if (selectedCategory === "정규직") return member.isTemporaryWorker === false;
    return true; // "직원" 선택 시 전체 직원 반환
  });

  //  서버에서 직원 리스트 가져오기
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

  // 직원 추가 API 요청
  const handleAddMember = async () => {
    if (!newMemberId.trim()) {
      alert("아이디를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(`${API_HOST}/admin/${adminId}/employees`, {
        loginId: newMemberId,
        isTemporaryWorker: isTemporary,
      });

      if (response.data.isSuccess) {
        alert("직원 추가 성공!");
        setMembers([...members, { userId: newMemberId, name: response.data.result.name }]);
        setNewMemberId("");
        setIsTemporary(false);
        setIsModalOpen(false);
      } else {
        alert("직원 추가 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("직원 추가 오류:", error);
      alert("직원 추가 중 오류가 발생했습니다.");
    }
  };

  // 직원 삭제 API 요청
  const deleteMember = async (userId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`${API_HOST}/admin/${adminId}/employees`, {
        data: {  //DELETE 요청의 바디 추가!
          isDeleteAllTemporaryWorker: false,  // 개별 삭제 모드
          userId: userId, // 삭제할 직원의 ID
        },
        headers: { "Content-Type": "application/json" }, // 헤더 설정 필수!
      });
  
      if (response.data.isSuccess) {
        alert("직원 삭제 성공!");
        setMembers(members.filter((member) => member.userId !== userId));
      } else {
        alert("직원 삭제 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("직원 삭제 오류:", error);
      alert("⚠️ 직원 삭제 중 오류가 발생했습니다.");
    }
  };

const deleteAllTemporaryWorkers = async () => {
  const confirmDelete = window.confirm("정말 모든 일용직 직원을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(`${API_HOST}/admin/${adminId}/employees`, {
      data: { isDeleteAllTemporaryWorker: true }, // 전체 삭제 요청
    });

    if (response.data.isSuccess) {
      alert("모든 일용직 직원이 삭제되었습니다!");
      setMembers(members.filter(member => !member.isTemporaryWorker)); // 화면에서도 제거
    } else {
      alert("직원 삭제 실패: " + response.data.message);
    }
  } catch (error) {
    console.error("직원 전체 삭제 오류:", error);
    alert("⚠️ 직원 삭제 중 오류가 발생했습니다.");
  }
};
  

  return (
    <div className="chat-page">
      {/* 네비게이션 바 */}
      <NavBar
        onAddClick={() => setIsModalOpen(true)}
        onToggleDeleteMode={() => setIsDeleteMode(!isDeleteMode)}
        isDeleteMode={isDeleteMode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onDeleteAllTemporaryWorkers={deleteAllTemporaryWorkers}
      />

      {/* 직원 리스트 */}
      <div className={`member-list ${isDeleteMode ? "delete-mode" : ""}`}>
        {filteredMembers.map((member) => (
          <div key={member.userId} className="member-item">
            {isDeleteMode && (
              <button className="delete-button" onClick={() => deleteMember(member.userId)}>
                ✕
              </button>
            )}
            <img src={defaultProfileImage} alt={member.name} className="member-img" />
            <span className="member-name">{member.name}</span>
          </div>
        ))}
      </div>

      {/* 직원 추가 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>✖</button>
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
