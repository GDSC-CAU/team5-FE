import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar"; // 기존 네비게이션 가져오기
import BottomNav from "./BottomNav"; // 기존 네비게이션 가져오기
import "./style.css"; // 스타일 적용
import API_HOST from "../../../constants/ApiHost";

export default function ReportListPage() {
  const [reports, setReports] = useState([]); // 신고 리스트 상태
  const adminId = localStorage.getItem("userId"); // 관리자 ID 가져오기

  // 서버에서 신고 리스트 가져오기
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_HOST}/report/${adminId}`);
        console.log("신고 리스트 데이터:", response.data);
        
        if (response.data.isSuccess) {
          setReports(response.data.result); // 서버에서 받은 데이터 저장
        } else {
          alert("신고 목록을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("신고 리스트 불러오기 오류:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    };

    if (adminId) fetchReports(); // adminId가 있을 때만 실행
  }, [adminId]);

  return (
    <div className="app-page report-list-page">
      <NavBar />

      {/* 신고 리스트 컨테이너 */}
      <div className="report-list">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.reportId} className="report-item">
              <p className="report-title">{JSON.parse(report.text).text || "내용 없음"}</p>
              <div className="report-info">
                <span className="report-label">신고 시간</span>
                <span className="report-date">{new Date(report.dateTime).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-report-message">등록된 신고가 없습니다.</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
