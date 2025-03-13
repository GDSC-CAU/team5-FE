import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./style.css";
import { ArrowLeft } from "lucide-react";
import API_HOST from "../../../../constants/ApiHost";
import defaultAdminAvatarImg from "../../../../assets/image/default-admin-avatar.png"
import UserRole from "../../../../constants/UserRole";

const SOCKET_URL = API_HOST + "/ws-connect";

const ChatPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTodo, setIsTodo] = useState(false); // "할 일" 체크박스 상태 추가
  const [translatedTexts, setTranslatedTexts] = useState(new Map());

  // 서버에서 기존 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_HOST}/chats/teams/${teamId}?userId=${userId}&role=${UserRole.ADMIN}`);
        setMessages(response.data.result.messages.reverse());
      } catch (error) {
        console.error("메시지 로딩 오류:", error);
      }
    };
    fetchMessages();
  }, [teamId, userId]);

  // WebSocket 연결
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

  // 메시지 전송
  const sendMessage = () => {
    if (stompClient.current && input.trim()) {
      const messageBody = {
        userId: userId,
        name: username,
        message: input.trim(),
        isTodo: isTodo, //할 일인지 여부 추가
      };
      console.log("보내는 메시지:", messageBody);

      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(messageBody));
      setInput("");
      setIsTodo(false); //전송 후 체크박스 해제
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
            <div key={index} className={`chat-section ${Number(msg.userId) === Number(userId) ? "user" : "admin"}`}>
              {Number(msg.userId) !== Number(userId) && (
                <>
                  <img src={msg.img || defaultAdminAvatarImg} alt={msg.name} className="chat-profile" />
                  <div className="chat-content">
                    <span className="chat-name">{msg.name}</span>
                    <div className="chat-bubble">{msg.message}</div>
                    <span className="chat-time">{msg.sendTime || new Date().toLocaleTimeString()}</span>
                  </div>
                </>
              )}

              {Number(msg.userId) === Number(userId) && (
                <div className="chat-content user">
                  <div className={`chat-bubble user-bubble ${msg.todo ? "todo-task" : ""}`}>
                    {msg.message}
                  </div>
                  <span className="chat-time">{msg.sendTime || new Date().toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* 메시지 입력창 + 할 일 체크박스 추가 */}
      <div className="chat-input-container">
        <label className="todo-checkbox">
          <input
            type="checkbox"
            checked={isTodo}
            onChange={() => setIsTodo(!isTodo)}
          />
          <span></span>{/*span안에 글자 널어도됨일단은*/}
        </label>
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
};

export default ChatPage;
