import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./style.css";
import { ArrowLeft } from "lucide-react";
import API_HOST from "../../../../constants/ApiHost";
import UserRole from "../../../../constants/UserRole";

const SOCKET_URL = API_HOST + "/ws-connect";

export default function ChatPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const userId = Number(localStorage.getItem("userId")); // 숫자로 변환하여 비교
  const username = localStorage.getItem("username");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [visibleTexts, setVisibleTexts] = useState(new Map());

  // ✅ 서버에서 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_HOST}/chats/teams/${teamId}?userId=${userId}&role=${UserRole.MEMBER}`
        );

        if (response.data.isSuccess) {
          const fetchedMessages = response.data.result.messages.reverse();
          setMessages(fetchedMessages);
        }
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
          console.log("New WebSocket Message:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
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

      console.log("보내는 메시지:", messageBody);
      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(messageBody));
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      {/* 🔹 상단 네비게이션 */}
      <div className="chat-header">
        <ArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h1 className="chat-title">{`채팅방 - ${teamId}`}</h1>
      </div>

      {/* 🔹 채팅 메시지 목록 */}
      <div className="chat-messages">
        {messages.map((msg, index) => {
          const chatId = msg.chatId;
          const isUser = Number(msg.userId) === userId;
          const hasTranslation = msg.translatedMessage && msg.translatedMessage.trim() !== "";

          return (
            <div key={index} className={`chat-section ${isUser ? "user" : "admin"}`}>
              {!isUser && (
                <>
                  <img src={msg.img || "/admin_profile.png"} alt={msg.name} className="chat-profile" />
                  <div className="chat-content">
                    <span className="chat-name">{msg.name}</span>
                    <div
                      className="chat-bubble"
                      onClick={() => {
                        if (!isUser && hasTranslation) {
                          setVisibleTexts((prev) => new Map(prev).set(chatId, !prev.get(chatId)));
                        }
                      }}
                    >
                      {msg.message}
                    </div>
                    <span className="chat-time">{msg.sendTime || new Date().toLocaleTimeString()}</span>

                    {/* 🔹 번역된 메시지 표시 */}
                    {visibleTexts.get(chatId) && hasTranslation && (
                      <div className="explanation-box">
                        <div className="explanation-content">
                          <p>{msg.translatedMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isUser && (
                <div className="chat-content user">
                  <div className="chat-bubble user-bubble">{msg.message}</div>
                  <span className="chat-time">{msg.sendTime || new Date().toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* 🔹 입력창 */}
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
