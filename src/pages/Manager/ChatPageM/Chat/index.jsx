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
  const [isTodo, setIsTodo] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState(new Map());

  //날짜함수 추가
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return `오늘 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    } else if (isYesterday) {
      return `어제 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    } else {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  };

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

  const sendMessage = () => {
    if (stompClient.current && input.trim()) {
      const messageBody = {
        userId: userId,
        name: username,
        message: input.trim(),
        isTodo: isTodo,
      };
      console.log("보내는 메시지:", messageBody);

      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(messageBody));
      setInput("");
      setIsTodo(false);
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
                    {/*날짜*/}
                    <span className="chat-time">{formatDate(msg.sendTime)}</span>
                  </div>
                </>
              )}

              {Number(msg.userId) === Number(userId) && (
                <div className="chat-content user">
                  <div className={`chat-bubble user-bubble ${msg.todo ? "todo-task" : ""}`}>
                    {msg.message}
                  </div>
                  {/*날짜*/}
                  <span className="chat-time">{formatDate(msg.sendTime)}</span>
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
          <span></span>
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
