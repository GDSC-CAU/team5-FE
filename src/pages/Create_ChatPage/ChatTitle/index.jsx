import React, { useState } from "react";
import "./style.css"; // 스타일 적용

const Item = ({ text }) => {
  return (
    <p className="chat-instruction">
      {text.split("\n").map((txt, index) => (
        <React.Fragment key={index}>
          {txt}
          <br />
        </React.Fragment>
      ))}
    </p>
  );
};

export default function ChatTitle() {
  const [chatName, setChatName] = useState(""); // 입력값 저장

  return (
    <div className="chat-title-container">
      <div className="chat-title">
        <Item text={"채팅창 명을 \n 입력해주세요"} />
      </div>
      <input 
        type="text"
        className="chat-input"
        placeholder="채팅창 이름을 입력하세요"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
      />
      <button className="next-button">다음</button>
    </div>
  );
}