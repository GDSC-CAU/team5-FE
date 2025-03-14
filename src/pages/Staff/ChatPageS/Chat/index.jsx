import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "./style.css";
import { ArrowLeft } from "lucide-react";
import API_HOST from "../../../../constants/ApiHost";
import UserRole from "../../../../constants/UserRole";
import defaultImage from "../../../../assets/image/default-avatar.png";

const SOCKET_URL = API_HOST + "/ws-connect";

export default function ChatPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const userId = Number(localStorage.getItem("userId"));
  const username = localStorage.getItem("username");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [visibleTexts, setVisibleTexts] = useState(new Map());
  const [highlightedTerms, setHighlightedTerms] = useState(new Map());

  // 날짜 포맷 함수
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
        const response = await axios.get(
          `${API_HOST}/chats/teams/${teamId}?userId=${userId}&role=${UserRole.MEMBER}`
        );

        if (response.data.isSuccess) {
          const fetchedMessages = response.data.result.messages.reverse();
          console.log("📥 서버에서 받은 메시지:", fetchedMessages);
          setMessages(fetchedMessages);
        }
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

  // 하이라이팅 단어 클릭 시 개별 번역
  // 메시지 전체 영역 클릭 시 전체 번역
  const highlightTerms = (text, translatedTerms, chatId) => {
    if (!translatedTerms || Object.keys(translatedTerms).length === 0) return text;

    let parts = [];
    let lastIndex = 0;
    const termEntries = Object.entries(translatedTerms).sort((a, b) => b[0].length - a[0].length);

    termEntries.forEach(([term, meaning]) => {
      const regex = new RegExp(term, "g");
      let match;
      while ((match = regex.exec(text)) !== null) {
        const termIndex = match.index;

        // 기존 텍스트 부분 추가
        parts.push(text.slice(lastIndex, termIndex));

        // 하이라이팅된 단어 추가
        parts.push(
          <span
            key={`${chatId}-${termIndex}-${term}`}
            className="highlight"
            onClick={(e) => {
              e.stopPropagation(); // 전체 번역 토글 방지
              setHighlightedTerms((prev) => {
                const newMap = new Map(prev);
                if (newMap.has(`${chatId}-${termIndex}-${term}`)) {
                  newMap.delete(`${chatId}-${termIndex}-${term}`);
                } else {
                  newMap.set(`${chatId}-${termIndex}-${term}`, meaning);
                }
                return newMap;
              });
            }}
          >
            {term}
          </span>
        );

        lastIndex = termIndex + term.length;
      }
    });

    parts.push(text.slice(lastIndex));
    return parts;
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
          const isUser = Number(msg.userId) === userId;
          const hasTranslation = msg.translatedMessage && msg.translatedMessage.trim() !== "";

          return (
            <div
              key={index}
              className={`chat-section ${isUser ? "user" : "admin"}`}
              onClick={() => {
                if (hasTranslation) {
                  setVisibleTexts((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(chatId, !newMap.get(chatId));
                    return newMap;
                  });
                }
              }}
            >
              {!isUser && (
                <>
                  <img src={msg.img || defaultImage} alt={msg.name} className="chat-profile" />
                  <div className="chat-content">
                    <span className="chat-name">{msg.name}</span>
                    <div className="chat-bubble">
                      {highlightTerms(msg.message, msg.translatedTerms, chatId)}
                    </div>
                    <span className="chat-time">{formatDate(msg.sendTime)}</span>

                    {/*번역된 단어 표시*/}
                    {Array.from(highlightedTerms.entries()).map(([key, meaning]) => {
                    const term = key.split('-').slice(2).join('-'); // key가 앞의 숫자 있어서 지우고 출력하려고 ~

                    return key.startsWith(`${chatId}-`) ? (
                      <div key={key} className="explanation-box">
                        <div className="explanation-content">
                          <p><strong>{term}</strong>: {meaning}</p>
                        </div>
                      </div>
                      ) : null;
                      })}


                    {/* 전체 번역된 메시지 표시 (하이라이팅 외의 영역 클릭 시 토글) */}
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
                  <span className="chat-time">{formatDate(msg.sendTime)}</span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
