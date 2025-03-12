import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar"; 
import BottomNav from "./BottomNav"; 
import "./style.css"; 
import API_HOST from "../../../constants/ApiHost";

export default function ChatListPage() {
  const [lists, setLists] = useState([]);
  const userId = localStorage.getItem("userId");

  // 서버에서 리스트 가져오기
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`${API_HOST}/chats/works?userId=${userId}`);
        
        if (response.data.isSuccess) {
          setLists(response.data.result); //서버 응답 데이터 설정
        } else {
          alert("리스트를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("리스트 불러오기 오류:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchLists();
  }, [userId]);

  return (
    <div className="check-list-page">
      <NavBar />

      {/* 리스트 컨테이너 */}
      <div className="check-list">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.chatId} className="check-item">
              <p className="check-title">{list.text}</p>
              <div className="check-info">
                <span className="check-label">채팅방 ID:</span>
                <span className="check-date">{list.teamId}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-check-message">작업이 없습니다.</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
