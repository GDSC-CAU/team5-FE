import React from "react";
import "./style.css"; // 스타일 적용
import MemberList from "../MemberList"; 

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

  return (
    <div className="chat-title-container">
      <div className="chat-title">
        <Item text={"구성원을 \n 선택해주세요"} />
      </div>
      <MemberList /> {/* ✅ 구성원 선택 리스트 추가 */}
      <button className="next-button2">다음</button>
    </div>
  );
}