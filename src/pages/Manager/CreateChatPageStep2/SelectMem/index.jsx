import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import MemberList from "../MemberList";
import API_HOST from "../../../../constants/ApiHost";

const Item = ({ text }) => (
  <p className="chat-instruction">
    {text.split("\n").map((txt, index) => (
      <React.Fragment key={index}>
        {txt}
        <br />
      </React.Fragment>
    ))}
  </p>
);

export default function SelectMem() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatName = location.state?.chatName || ""; // 전달받은 채팅방 이름
  let [selectedMembers, setSelectedMembers] = useState([]); // 선택한 사용자 목록

  const handleCreateChat = async () => {
    const creatorId = localStorage.getItem("userId"); // 채팅방 생성자 ID 가져오기
  
    if (!chatName.trim()) {
      alert("채팅방 이름이 없습니다!");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("적어도 한 명 이상의 멤버를 선택해주세요.");
      return;
    }

    selectedMembers.push(creatorId);
  
    const requestBody = {
      name: chatName, // 채팅방 이름
      creatorId: creatorId, // 채팅방 만든 유저 ID 추가
      userIds: selectedMembers, // 초대할 사용자 ID 리스트
    };
  
    try {
      console.log("📡 채팅방 생성 요청 데이터:", requestBody); // 디버깅용 로그
      const response = await axios.post(`${API_HOST}/teams`, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("📨 서버 응답:", response.data); // 서버 응답 로그
  
      if (response.data.isSuccess) {
        alert("✅ 채팅방이 생성되었습니다!");
        navigate("/managerChat"); // 성공 시 채팅 리스트로 이동
      } else {
        alert(response.data.message || "❌ 채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 오류:", error);
      alert("⚠️ 서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  

  return (
    <div className="chat-title-container">
      <div className="chat-title">
        <Item text={"구성원을 \n 선택해주세요"} />
      </div>
      <MemberList onSelect={setSelectedMembers} />
      <button className="next-button2" onClick={handleCreateChat}>채팅방 생성</button>
    </div>
  );
}
