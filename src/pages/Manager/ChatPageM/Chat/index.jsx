import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./style.css";
import { ArrowLeft } from "lucide-react";

// ✅ WebSocket 연결 주소
const SOCKET_URL = "http://localhost:8080/ws-connect";

// ✅ 현재 날짜를 "YYYY년 MM월 DD일 (요일)" 형식으로 변환하는 함수
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
  return `${year}년 ${month.toString().padStart(2, "0")}월 ${date.toString().padStart(2, "0")}일 (${day})`;
};

// ✅ 현재 시간을 "오전/오후 h:mm" 형식으로 변환하는 함수
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
  const { teamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [translatedTexts, setTranslatedTexts] = useState(new Map());
  const [visibleTexts, setVisibleTexts] = useState(new Map());

  // ✅ 서버에서 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/chats/teams/${teamId}?userId=${userId}`);
        setMessages(response.data.result.messages.reverse()); // 최신 메시지가 아래에 오도록 정렬
      } catch (error) {
        console.error("메시지 로딩 오류:", error);
      }
    };

    fetchMessages();
  }, [teamId, userId]);

  // ✅ WebSocket 연결
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS(SOCKET_URL);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        stompClient.current.subscribe(`/sub/chats/${teamId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });

        stompClient.current.subscribe(`/sub/translate/${teamId}/${userId}`, (message) => {
          const { chatId, translatedText } = JSON.parse(message.body);
          setTranslatedTexts((prevMap) => new Map(prevMap).set(chatId, translatedText));
        });
      });
    };

    connectWebSocket();

    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [teamId, userId]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (stompClient.current && input.trim()) {
      const messageBody = {
        userId: userId,
        name: username,
        message: input.trim(),
        todo: false,
      };

      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(messageBody));
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      {/* 상단 네비게이션 */}
      <div className="chat-header">
        <ArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h1 className="chat-title">{`채팅방 - ${teamId}`}</h1>
      </div>

      {/* 채팅 메시지 목록 */}
      <div className="chat-messages">
        {messages.map((msg, index) => {
          const chatId = msg.chatId;
          const hasTranslation = translatedTexts.has(chatId);

          return (
            <div key={index} className={`chat-section ${msg.userId === userId ? "user" : "admin"}`}>
              {/* 관리자 메시지 */}
              {msg.userId !== userId && (
                <>
                  <img src={msg.img || "/admin_profile.png"} alt={msg.name} className="chat-profile" />
                  <div className="chat-content">
                    <span className="chat-name">{msg.name}</span>
                    <div className="chat-bubble">{msg.message}</div>
                    <span className="chat-time">{msg.sendTime || getCurrentTime()}</span>

                    {/* 번역 버튼 */}
                    {hasTranslation && (
                      <button
                        onClick={() => setVisibleTexts((prev) => new Map(prev).set(chatId, !prev.get(chatId)))}
                        className="translate-btn"
                      >
                        {visibleTexts.get(chatId) ? "번역 숨기기" : "번역 보기"}
                      </button>
                    )}

                    {/* 번역된 문장 표시 */}
                    {visibleTexts.get(chatId) && hasTranslation && (
                      <p className="translated-text">{translatedTexts.get(chatId)}</p>
                    )}
                  </div>
                </>
              )}

              {/* 사용자 메시지 */}
              {msg.userId === userId && (
                <div className="chat-content user">
                  <div className="chat-bubble user-bubble">{msg.message}</div>
                  <span className="chat-time">{msg.sendTime || getCurrentTime()}</span>
                </div>
              )}
            </div>
          );
        })}
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
