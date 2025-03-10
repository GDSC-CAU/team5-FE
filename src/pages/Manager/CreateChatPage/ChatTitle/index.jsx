import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

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

export default function ChatTitle() {
  const [chatName, setChatName] = useState(""); // ✅ 채팅방 이름 상태
  const navigate = useNavigate();

  // ✅ 다음 버튼 클릭 시 채팅방 이름을 가지고 이동
  const handleNext = () => {
    if (!chatName.trim()) {
      alert("채팅방 이름을 입력해주세요!");
      return;
    }
    navigate("/CreateChat2", { state: { chatName } }); // ✅ 상태 전달
  };

  return (
    <div className="chat-title-container">
      <div className="chat-title">
        <Item text={"채팅창 명을 \n 입력해주세요"} />
      </div>
      <input 
        type="text"
        className="name-input"
        placeholder="채팅창 이름을 입력하세요"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
      />
      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}
