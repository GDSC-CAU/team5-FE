import React, { useState, useEffect, useRef } from "react";
import "./style.css"; // 스타일 적용
import { ArrowLeft } from "lucide-react"; // 뒤로가기 아이콘
import { useNavigate } from "react-router-dom";

// 현재 날짜를 "YYYY년 MM월 DD일 (요일)" 형식으로 변환하는 함수
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
  return `${year}년 ${month.toString().padStart(2, "0")}월 ${date.toString().padStart(2, "0")}일 (${day})`;
};

// 현재 시간을 "오전/오후 h:mm" 형식으로 변환하는 함수
const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let period = hours >= 12 ? "오후" : "오전";

  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");

  return `${period} ${hours}:${minutes}`;
};

export default function ChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      name: "관리자",
      img: "/admin_profile.png",
      text: "다들 10시부터 공구리 깔아라",
      time: getCurrentTime(),
      date: getCurrentDate(),
      showExplanation: false,
    },
    {
      id: 2,
      sender: "user",
      name: "사용자",
      text: "공구리 작업 시작합니다!",
      time: getCurrentTime(),
      date: getCurrentDate(),
      showExplanation: false,
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // ✅ 스크롤을 위한 Ref

  // ✅ 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // "공구리" 클릭 시 설명 토글
  const toggleExplanation = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, showExplanation: !msg.showExplanation } : msg
      )
    );
  };

  // 메시지 전송
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        name: "사용자",
        text: input,
        time: getCurrentTime(),
        date: getCurrentDate(),
        showExplanation: false,
      };

      setMessages([...messages, newMessage]);
      setInput(""); // 입력 필드 초기화
    }
  };

  return (
    <div className="chat-container">
      {/* 상단 네비게이션 */}
      <div className="chat-header">
        <ArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h1 className="chat-title">"Q-Company 2025"</h1>
      </div>

      {/* 채팅 메시지 목록 */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-section ${msg.sender}`}>
            {/* 관리자 메시지 */}
            {msg.sender === "admin" && (
              <>
                <img src={msg.img} alt={msg.name} className="chat-profile" />
                <div className="chat-content">
                  <span className="chat-name">{msg.name}</span>
                  <div className="chat-bubble">
                    {msg.text.split("공구리").map((part, index, arr) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < arr.length - 1 && (
                          <span
                            className="highlight"
                            onClick={() => toggleExplanation(msg.id)}
                          >
                            공구리
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="chat-time">{msg.time}</span>

                  {/* 설명과 번역 */}
                  {msg.showExplanation && (
                    <div className="explanation-box">
                      <p>💬 번역: Mọi người hãy đặt dụng cụ của mình xuống bắt đầu từ lúc 10 giờ.</p>
                      <div className="explanation-content">
                        <div>
                          <p><strong>공구리</strong> = 콘크리트 (bê tông)</p>
                          <p>콘크리트는 건축물의 기초를 다질 때 사용되는 재료입니다.</p>
                        </div>
                        <img src="/concrete.png" alt="공구리" className="explanation-image" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 사용자 메시지 */}
            {msg.sender === "user" && (
              <div className="chat-content user">
                <div className="chat-bubble user-bubble">
                  {msg.text}
                </div>
                <span className="chat-time">{msg.time}</span>
              </div>
            )}
          </div>
        ))}
        {/* ✅ 스크롤 자동 이동을 위한 빈 div */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* 메시지 입력창 */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}
