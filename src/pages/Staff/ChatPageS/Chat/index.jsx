import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./style.css";
import { ArrowLeft } from "lucide-react";
import API_HOST from "../../../../constants/ApiHost";

const SOCKET_URL = API_HOST + "/ws-connect";

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_HOST}/chats/teams/${teamId}?userId=${userId}`);
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
        todo: false,
      };

      stompClient.current.send(`/pub/chats/teams/${teamId}`, {}, JSON.stringify(messageBody));
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <ArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h1 className="chat-title">{`채팅방 - ${teamId}`}</h1>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const chatId = msg.chatId;
          const hasTranslation = translatedTexts.has(chatId);
          const isUser = msg.name === username;
          console.log("msg.name:", msg.name, "userId:", username, "isUser:", msg.name === username);

          return (
            <div key={index} className={`chat-section ${isUser ? "user" : "admin"}`}>
              {!isUser && (
                <>
                  <img src={msg.img || "/admin_profile.png"} alt={msg.name} className="chat-profile" />
                  <div className="chat-content">
                    <span className="chat-name">{msg.name}</span>
                    <div className="chat-bubble">{msg.message}</div>
                    <span className="chat-time">{msg.sendTime || new Date().toLocaleTimeString()}</span>
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
