import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ChatItem from "../ChatItem";
import "./style.css";
import API_HOST from "../../../../constants/ApiHost";
import logoImg from "../../../../assets/image/Logo.png";

const ChatList = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const stompClient = useRef(null);

  // 서버에서 채팅방 리스트 가져오기
  const fetchUserTeams = async () => {
    try {
      const response = await axios.get(`${API_HOST}/user-teams/users/${userId}`);
      console.log("채팅방 데이터:", response.data);
      setChatRooms(response.data.result);
    } catch (error) {
      console.error("채팅방 목록 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchUserTeams(); //처음 화면 로딩 시 채팅방 불러오기

    const socket = new SockJS(`${API_HOST}/ws-connect`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/sub/teams/${userId}`, (message) => {
        const updatedChat = JSON.parse(message.body);
        setChatRooms((prevChats) => {
          const existingIndex = prevChats.findIndex(chat => chat.teamId === updatedChat.teamId);
          let updatedChats = [...prevChats];
          if (existingIndex !== -1) {
            updatedChats[existingIndex] = { ...updatedChats[existingIndex], ...updatedChat };
          } else {
            updatedChats.push(updatedChat);
          }
          return updatedChats.sort((a, b) => b.lastChatTime - a.lastChatTime);
        });
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [userId]);

  // 채팅을 길게 누르거나 우클릭하면 삭제 버튼 표시
  const handleLongPress = (id) => {
    setSelectedChat((prev) => (prev === id ? null : id));
  };

  // 삭제 버튼 클릭 시 확인 후 삭제
  const handleDeleteChat = async (teamId, event) => {
    event.stopPropagation();
  
    const confirmDelete = window.confirm("이 채팅을 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    try {
      console.log(`삭제 요청 보냄: DELETE ${API_HOST}/teams/${teamId}`);
      console.log("삭제할 teamId:", teamId);
      await axios.delete(`${API_HOST}/teams/${teamId}`);
  
      console.log("채팅 삭제 성공");
  
      //전체 목록을 다시 불러오지 않고 삭제된 `teamId`만 제외
      setChatRooms((prevChats) => prevChats.filter(chat => chat.teamId !== teamId));
  
      setSelectedChat(null);
    } catch (error) {
      console.error("채팅 삭제 오류:", error.response || error);
    }
  };
  

  return (
    <div className="chat-list">
      {chatRooms.map((chat) => (
        <div
          key={chat.teamId}
          className="chat-item-container"
          onClick={() => {
            if (selectedChat !== chat.teamId) {
              navigate(`/chat1/${chat.teamId}`);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleLongPress(chat.teamId);
          }}
        >
          <ChatItem
            img={chat.img || logoImg}
            title={`${chat.teamName}`}
            message={chat.lastChat || "새로운 채팅이 없습니다."}
            time={chat.lastChatTime || ""}
          />

          {/* 선택된 채팅에만 삭제 버튼 표시 */}
          {selectedChat === chat.teamId && (
            <button className="delete-chat-btn" onClick={(e) => handleDeleteChat(chat.teamId, e)}>
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
